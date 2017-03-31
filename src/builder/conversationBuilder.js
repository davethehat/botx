'use strict';

module.exports = conversationBuilder;

const conversationResponse = require('./conversationResponse');


function qthread() {

  return {
    questions : [],
    current : null,

    question(question, captureOptions) {
      this.current = {
        question: question,
        captureOptions: captureOptions,
        responses: []
      };
      this.questions.push(this.current);
    },

    into(key) {
      this.current.captureOptions = {key};
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
    currentThreadName: 'default',

    ask(question, threadname = 'default') {
      const thread = this._switchToThread(threadname);
      thread.question(question, {key: threadname});
      return this;
    },

    into(key) {
      this.threads[this.currentThreadName].into(key);
      return this;
    },

    inThread(threadname) {
      this._switchToThread(threadname);
      return this;
    },

    _switchToThread(threadname) {
      if (!this.threads[threadname]) {
        this.threads[threadname] = qthread();
      }
      this.currentThreadName = threadname;
      return this.threads[threadname];
    },

    when(pattern) {
      return conversationResponse(pattern, this.currentThreadName, this)
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

    afterwards(fn) {
      this.onEnd = fn;
      return this;
    },

    create() {
      return (bot, message) => {
        bot.createConversation(message, (err, conv) => {

          Object.keys(this.threads).forEach(threadName => {
            const thread = this.threads[threadName];
            thread.questions.forEach(qandr => {
              conv.addQuestion(qandr.question, qandr.responses, qandr.captureOptions, threadName);
            });
          });

          const defaultThread = this.threads['default'];

          conv.ask(defaultThread.questions[0].question, defaultThread.questions[0].responses, defaultThread.questions[0].captureOptions);

          if (this.onEnd) {
            conv.on('end', this.onEnd);
          }

          conv.activate();
        });
      }
    }
  }
}
