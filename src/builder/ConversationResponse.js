const util = require('../util/util');

class ConversationResponse {
  constructor(pattern, threadname, builder) {
    this.pattern = pattern;
    this.threadname = threadname;
    this.builder = builder;
  }
  switchTo(newThreadname) {
    let fn = (response, conv) => {
      conv.gotoThread(newThreadname);
    };
    return this.builder.addPatternAction(this.pattern, this.threadname, fn);
  }

  then(fn) {
    return this.builder.addPatternAction(this.pattern, this.threadname, fn)
  }

  thenSay(s, action = 'next') {
    let fn = (response, conv) => {
      conv.say(Array.isArray(s) ? util.chooseFrom(s) : s);
      conv[action]();
    };
    return this.builder.addPatternAction(this.pattern, this.threadname, fn)
  }
}

module.exports = ConversationResponse;
