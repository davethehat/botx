const ConversationResponse = require('./ConversationResponse');
const QuestionThread = require('./QuestionThread');

class ConversationBuilder {
  constructor(botx) {
    this.botx = botx;
    this.threads = {};
    this.currentThreadName = 'default';
  }

  ask(question, threadname = 'default') {
    const thread = this._switchToThread(threadname);
    thread.question(question, {key: threadname});
    return this;
  }

  into(key) {
    this._currentThread().into(key);
    return this;
  }

  when(pattern) {
    return new ConversationResponse(pattern, this.currentThreadName, this)
  }

  addPatternAction(pattern, threadname, action) {
    this.threads[threadname].action({pattern: pattern, callback: action});
    return this;
  }

  otherwise(message, threadname='default') {
    const f = (response, conv) => {
      conv.say(message);
      conv.next();
    };
    this.threads[threadname].action({default: true, callback: f});
    return this;
  }
  
  create(fn = () => {}) {

    this.onCompletion = conv => {
      fn(conv.extractResponses(), this.botx)
    };
    
    return (bot, message) => {
      bot.createConversation(message, (err, conv) => {

        Object.keys(this.threads)
          .filter(name => name !== 'default')
          .forEach(threadName => {
          const thread = this.threads[threadName];
          thread.questions.forEach(qandr => {
            conv.addQuestion(qandr.question, qandr.responses, qandr.captureOptions, threadName);
          });
        });

        const defaultThread = this.threads['default'];
        conv.ask(defaultThread.questions[0].question,
          defaultThread.questions[0].responses,
          defaultThread.questions[0].captureOptions);
        
        conv.on('end', this.onCompletion);

        conv.activate();
      });
    }
  }

  _switchToThread(threadname) {
    if (!this.threads[threadname]) {
      this.threads[threadname] = new QuestionThread();
    }
    this.currentThreadName = threadname;
    return this._currentThread();
  }

  _currentThread() {
    return this.threads[this.currentThreadName];
  }
}

module.exports = ConversationBuilder;

