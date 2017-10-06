'use strict';

const botkit = require('botkit');
const WrappedBot = require('../bot/WrappedBot');

module.exports = {
  initialise(config) {
    config.token = config.token || process.env.SLACK_API_TOKEN;

    if (!config.token) {
      throw new Error('Error: Specify token in config or in environment: SLACK_API_TOKEN');
    }

    this.botkitController = botkit.slackbot(config);
    this.botkitBot = this.botkitController.spawn({
      token: config.token
    }).startRTM();

    this.log = this.botkitController.log;
    this.utterances = this.botkitBot.utterances;

    return new WrappedBot(config, this);
  },

  say(what) {
    this.botkitBot.say(what)
  },

  reply(message, what) {
    this.botkitBot.reply(message, what);
  },

  hears(patterns, events, fn) {
    this.botkitController.hears(patterns, events, fn);
  },
};