'use strict';

const botkit = require('botkit');
const _ = require('lodash');

const WrappedBot = require('./bot/WrappedBot');

const DEFAULT_CONFIG = {
  debug: false,
  require_delivery: true,
  stats_optout: true,
  error: 'Oh dear: {{error}}',
  shutdown: {
    trigger: 'shutdown',
    question: 'Are you sure?',
    onYes: 'Shutting down...',
    onNo: 'Continuing...'
  },
  help: {
    trigger: '^bot help',
    messages: ['I am a bot!']
  }
};

function botx(userConfig = {}) {
  const config = _.merge({}, DEFAULT_CONFIG, userConfig);
  const controller = botkit.slackbot(config);

  config.token = config.token || process.env.SLACK_API_TOKEN;
  if (!config.token) {
    console.log('Error: Specify token in config or in environment: SLACK_API_TOKEN');
    process.exit(1);
  }

  const bot = controller.spawn({
    token: config.token
  }).startRTM();
  
  const wrappedBot = new WrappedBot(bot, controller, config);

  installShutdownConversation(wrappedBot);
  installHelp(wrappedBot);

  return wrappedBot;
}

function installShutdownConversation(wrappedBot) {
  const shutdownConfig = wrappedBot.config.shutdown;
  const quitConversation = wrappedBot.conversation()
    .ask(shutdownConfig.question)
    .when(wrappedBot.utterances.yes).then((response, conv) => {
      conv.say(shutdownConfig.onYes);
      conv.next();
      setTimeout(function () {
        process.exit();
      }, 5000);
    })
    .otherwise(shutdownConfig.onNo)
    .create();

  wrappedBot.when(shutdownConfig.trigger)
    .thenStartConversation(quitConversation)
    .go();
}

function installHelp(wrappedBot) {
  const helpConfig = wrappedBot.config.help;
  const shutdownConfig = wrappedBot.config.shutdown;
  const builder = wrappedBot.when(helpConfig.trigger);

  helpConfig.messages.forEach(m => builder.thenSay(m));
  builder.thenSay('---------');
  builder.thenSay(`Say "${shutdownConfig.trigger}" to turn me off`);

  builder.go();
}

module.exports = botx;

