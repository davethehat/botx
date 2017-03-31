'use strict';

module.exports = botx;

const Botkit = require('botkit');
const builder = require('./builder/builder');
const conversationBuilder = require('./builder/conversationBuilder');

const DEFAULT_CONFIG = {
  debug: false,
  require_delivery: true,
  stats_optout: true,
  error: 'Oh dear: {}',
  shutdown: {
    trigger: 'shutdown',
    question: 'Are you sure?',
    onYes: 'Shutting down...',
    onNo: 'Continuing...'
  }
};

function botx(userConfig = {}) {
  const config = Object.assign({}, DEFAULT_CONFIG, userConfig);
  const controller = Botkit.slackbot(config);

  let bot = controller.spawn({
    token: config.token
  }).startRTM();

  const wrappedBot = {
    controller: controller,
    bot: bot,
    
    when(pattern) {
      return builder(this, pattern);
    },
    
    conversation() {
      return conversationBuilder(this);
    },
    
    linkOrBust(err, message, link) {
      if (link) {
        bot.reply(message, `${link.display} (${link.href})`);
      } else {
        const errorText = err ? err.toString() : 'something went wrong';
        bot.reply(message, config.error.replace('{}', errorText));
      }
    },
    
    log: controller.log,

    utterances: bot.utterances
  };
  
  installShutdownConversation(wrappedBot, config.shutdown);

  return wrappedBot;
}

function installShutdownConversation(wrappedBot, shutdownConfig) {
  const quitConversation = wrappedBot.conversation()
    .ask(shutdownConfig.question)
    .when(wrappedBot.utterances.yes).then((response, conv) => {
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

