'use strict';

module.exports = builder;

function builder(botx, pattern) {
  return {
    botx: botx,
    patterns: [pattern],
    responses: [],

    or(anotherPattern) {
      this.patterns.push(anotherPattern);
      return this;
    },

    then(fn) {
      this.responses.push(fn);
      return this;
    },

    thenSay(what) {
      return this.then(function(bot, message) {
        let response = what;
        for (let matchIndex = 1; matchIndex <= message.match.length; matchIndex++) {
          const re = new RegExp('\\$' + matchIndex, 'g');
          response = response.replace(re, message.match[matchIndex]);
        }
        bot.reply(message, response);
      })
    },

    thenStartConversation(conversation) {
      return this.then(conversation);
    },

    go() {
      this.botx.controller.hears(this.patterns, 'direct_message,direct_mention,mention', (bot, message) => {
        const loop = (responses, index) => {
          if (index >= responses.length) return;
          const fn = responses[index];
          fn(bot, message);
          setTimeout(() => {loop(responses, index+ 1)}, 500);
        };
        loop(this.responses, 0);
      });
    }
  }
}