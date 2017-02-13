'use strict';

var os = require('os');

var Botkit = require('botkit');
var scrape = require('scrape');

const DEFAULT_CONFIG = {
  debug: true,
  require_delivery: true,
  shutdown: {
    trigger: 'shutdown',
    question: 'Are you sure?',
    onYes: 'Shutting down...',
    onNo: 'Continuing...'
  }
};

module.exports = botx;

function botx(userConfig = {}) {
  let config = Object.assign({}, DEFAULT_CONFIG, userConfig);
 
  let controller = Botkit.slackbot(config);
 
  let bot = controller.spawn({
    token: config.token
  }).startRTM();

  let wrappedBot = {
    controller: controller,
    bot: bot,
    when(pattern) {
      return builder(this, pattern);
    },
    conversation() {
      return conversationBuilder(this);
    }
  };
  
  if (config.shutdown) {
    installShutdownConversation(wrappedBot, config.shutdown);
  }
  
  return wrappedBot;
}

function installShutdownConversation(wrappedBot, shutdownConfig) {
  let quitConversation = wrappedBot.conversation()
    .ask(shutdownConfig.question)
    .when('yes').then((response, conv) => {
      conv.say(shutdownConfig.onYes);
      conv.next();
      setTimeout(function () {
        process.exit();
      }, 3000);
    })
    .otherwise(shutdownConfig.onNo)
    .create();

  wrappedBot.when(shutdownConfig.trigger)
    .thenStartConversation(quitConversation)
    .go();
}

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
          let re = new RegExp('\\$' + matchIndex, 'g');
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
        let loop = (responses, index) => {
          if (index >= responses.length) return;
          let fn = responses[index];
          fn(bot, message);
          setTimeout(() => {loop(responses, index+ 1)}, 500);
        };
        loop(this.responses, 0);
      });
    }
  }
}

function conversationBuilder(botx) {
  return {
    controller: botx.controller,
    bot: botx.bot,
    question: null,
    responses: [],

    ask: function(question) {
      this.question = question;
      return this;
    },

    when: function(pattern) {
      return conversationResponse(pattern, this)
    },

    addPatternAction: function(pattern, action) {
      this.responses.push({pattern: pattern, callback: action});
      return this;
    },

    otherwise: function(s) {
      let f = (response, conv) => {
        conv.say(s);
        conv.next();
      };
      this.responses.push({default: true, callback: f});
      return this;
    },

    create: function() {
      return (bot, message) => {
        bot.startConversation(message, (err, conv) => {
          conv.ask(this.question, this.responses)
        });
      }
    }
  }
}

function conversationResponse(pattern, builder) {
  return {
    pattern: pattern,
    builder: builder,

    then: function(fn) {
      return builder.addPatternAction(this.pattern, fn)
    },

    thenSay: function(s) {
      let f = (response, conv) => {
        conv.say(s);
        conv.next();
      };
      return builder.addPatternAction(this.pattern, f)
    }
  }
}

