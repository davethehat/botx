const { chooseFrom } = require('../util/util');

class ConversationResponse {
  constructor(pattern, threadName, builder) {
    this.pattern = pattern;
    this.threadName = threadName;
    this.builder = builder;
  }

  switchTo(newThreadName) {
    const fn = (response, conv) => {
      conv.gotoThread(newThreadName);
    };
    return this.then(fn);
  }

  thenSay(...responses) {
    return this.thenSayWithAction(responses, 'next')
  }

  thenSayWithAction(responses, action) {
    const fn = (response, conv) => {
      conv.say(chooseFrom(responses));
      conv[action]();
    };
    return this.then(fn);
  }

  then(fn) {
    return this.builder.addPatternAction(this.pattern, this.threadName, fn)
  }
}

module.exports = ConversationResponse;
