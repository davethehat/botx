const Builder = require('./../builder/Builder');
const ConversationBuilder = require('./../builder/ConversationBuilder');

class WrappedBot {
  constructor(bot, controller, config) {
    this.bot = bot;
    this.controller = controller;
    this.utterances = bot.utterances;
    this.log = controller.log;
    this.config = config;
    this.link = this._link.bind(this);
    this.error = this._error.bind(this);
  }

  when(pattern) {
    return new Builder(this, pattern);
  }

  conversation() {
    return new ConversationBuilder(this);
  }

  _error(bot, message) {
    return err => {
      const errorText = err ? err.toString() : 'something went wrong';
      bot.reply(message, this.config.error.replace('{{error}}', errorText));
    }
  }
  
  _link(bot, message) {
    return link =>  bot.reply(message, `${link.display} (${link.href})`);
  }
}

module.exports = WrappedBot;
