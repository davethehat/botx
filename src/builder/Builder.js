const { chooseFrom } = require('../util/util');

const RESPONSE_DELAY = 1000;

class Builder {
  constructor(wrappedBot, pattern) {
    this.wrappedBot = wrappedBot;
    this.patterns = [pattern];
    this.responses = [];
  }
  
  or(anotherPattern) {
    this.patterns.push(anotherPattern);
    return this;
  }

  then(fn) {
    this.responses.push(fn);
    return this;
  }

  thenSay(...what) {
    return this.then((bot, message) => {
      let response = chooseFrom(what);
      for (let matchIndex = 1; matchIndex <= message.match.length; matchIndex++) {
        const re = new RegExp(`\\{\\{${matchIndex}\\}\\}`, 'g');
        response = response.replace(re, message.match[matchIndex]);
      }
      bot.reply(message, response);
    })
  }

  thenCallWithOneMatch(fn, ok, error) {
    return this.then((bot, message) => {
      const match = ok.match || message.match[1];
      const cbOK = ok.ok || ok;
      const cbError = ok.error || error || this.wrappedBot.error;

      fn(match, cbOK(bot, message), cbError(bot, message));
    })
  }

  thenStartConversation(conversation) {
    return this.then(conversation);
  }

  go(events = ['direct_message','direct_mention','mention']) {
    this.wrappedBot.hears(this.patterns, events, (bot, message) => {
      const loop = (responses, index) => {
        if (index >= responses.length) return;
        const fn = responses[index];
        fn(bot, message);
        setTimeout(() => {loop(responses, index+ 1)}, RESPONSE_DELAY);
      };
      loop(this.responses, 0);
    });
  }
}

module.exports = Builder;