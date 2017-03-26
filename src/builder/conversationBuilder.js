'use strict';

module.exports = conversationBuilder;

const conversationResponse = require('./conversationResponse');




function qthread() {

  return {
    qandr : [],
    current : null,

    question(q) {
      this.current = {
        question: q,
        responses: []
      };
      this.qandr.push(this.current);
    },

    action(r) {
      this.current.responses.push(r);
    }
  }
}


function conversationBuilder(botx) {
  return {
    controller: botx.controller,
    bot: botx.bot,
    question: null,
    responses: [],
    threads: {},
    currentThread: 'default',

    dump() {
      console.log(this.question, this.responses);
      console.log(this.threads);
      return this;
    },

    ask(question, threadname = 'default') {
      this.currentThread = threadname;
      let thread = this.threads[threadname] || qthread();

      thread.question(question);

      this.threads[threadname] = thread;

      return this;
    },

    thenAsk(question) {
      return this;
    },

    inThread(threadname) {
      this.currentThread = threadname;
      return this;
    },

    when(pattern) {
      return conversationResponse(pattern, this.currentThread, this)
    },

    addPatternAction(pattern, threadname, action) {
      this.threads[threadname].action({pattern: pattern, callback: action});
      return this;
    },

    otherwise(s, threadname='default') {
      const f = (response, conv) => {
        conv.say(s);
        conv.next();
      };
      this.threads[threadname].action({default: true, callback: f});
      return this;
    },

    create() {
      return (bot, message) => {
        bot.createConversation(message, (err, conv) => {

          Object.keys(this.threads).forEach(threadName => {
            const thread = this.threads[threadName];
            conv.addQuestion(thread.question, thread.responses, {}, threadName);
          });

          const defaultThread = this.threads['default'];

          conv.ask(defaultThread.qandr[0].question, defaultThread.qandr[0].responses);
          
          conv.activate();
        });
      }
    }
  }
}
