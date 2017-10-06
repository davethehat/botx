const Builder = require('./../builder/Builder');
const ConversationBuilder = require('./../builder/ConversationBuilder');

class WrappedBot {
  constructor(config, adapter) {
    this.adapter = adapter;
    this.utterances = adapter.utterances;
    this.log = adapter.log;
    this.config = config;
    this.link = this._link.bind(this);
    this.error = this._error.bind(this);
  }

  start() {
    this.log.notice(`${this.config.name} starting...`);

    if (this.config.shutdown) {
      this.installShutdownConversation();
    }

    if (this.config.help) {
      this.installHelp();
    }
  }

  when(pattern) {
    return new Builder(this, pattern);
  }

  say(what) {
    this.adapter.say(what);
  }

  reply(message, what) {
    this.adapter.reply(message, what);
  }

  hears(patterns, events, fn) {
    this.adapter.hears(patterns, events, fn);
  }

  conversation() {
    return new ConversationBuilder(this);
  }

  installShutdownConversation() {
    const shutdownConfig = this.config.shutdown;

    const quitConversation = this.conversation()
      .ask(shutdownConfig.question)
      .when(this.utterances.yes).then((response, conv) => {
        conv.say(shutdownConfig.onYes);
        conv.next();
        setTimeout(function () {
          process.exit();
        }, 5000);
      })
      .otherwise(shutdownConfig.onNo)
      .create();

    this.when(shutdownConfig.trigger)
      .thenStartConversation(quitConversation)
      .go();
  }


  installHelp() {
    const helpConfig = this.config.help;
    const shutdownConfig = this.config.shutdown;
    const builder = this.when(helpConfig.trigger);

    helpConfig.messages.forEach(m => builder.thenSay(m));
    builder.thenSay('---------');
    builder.thenSay(`Say "${shutdownConfig.trigger}" to turn me off`);
    builder.go();
  }


  _error(bot, message) {
    return err => {
      const errorText = err ? err.toString() : 'something went wrong';
      bot.reply(message, this.config.error.replace('{{error}}', errorText));
    }
  }

  _link(bot, message) {
    return link => bot.reply(message, `${link.display} (${link.href})`);
  }
}

module.exports = WrappedBot;
