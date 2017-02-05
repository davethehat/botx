if (!process.env.token) {
  console.log('Error: Specify token in environment');
  process.exit(1);
}

var Botkit = require('botkit');
var os = require('os');


const DEFAULT_CONFIG = {
  debug: true,
  require_delivery: true
};

function botx(userConfig = {}) {
  let config = Object.assign({}, DEFAULT_CONFIG, userConfig);
  let controller = Botkit.slackbot(config);
  let bot = controller.spawn({
    token: process.env.token
  }).startRTM();

  respondToShutdown(controller);
  
  function respondToShutdown(controller) {
    controller.hears(['shutdown'], 'direct_message,direct_mention,mention', function(bot, message) {

      bot.startConversation(message, function(err, convo) {

        convo.ask('Are you sure you want me to shutdown?', [
          {
            pattern: bot.utterances.yes,
            callback: function(response, convo) {
              convo.say('Bye!');
              convo.next();
              setTimeout(function() {
                process.exit();
              }, 3000);
            }
          },
          {
            pattern: bot.utterances.no,
            default: true,
            callback: function(response, convo) {
              convo.say('*Phew!*');
              convo.next();
            }
          }
        ]);
      });
    });
  }
  
  return {
    controller: controller,
    bot: bot,
    whenBotHears: function(pattern)  {
      return builder(this, pattern);
    }
  }
}


function builder(botx, pattern) {
  return {
    botx: botx,
    patterns: [pattern],
    responses: [],
    orBotHears: function(anotherPattern) {
      this.patterns.push(anotherPattern);
      return this;
    },
    then: function(fn) {
      this.responses.push(fn);
      return this;
    },
    thenReply(what) {
      return this.then(function(bot, message) {
        let response = what;
        for (let matchIndex = 1; matchIndex <= message.match.length; matchIndex++) {
          let re = new RegExp('\\$' + matchIndex, 'g');
          response = response.replace(re, message.match[matchIndex]);
        }
        bot.reply(message, response);
      })
    },
    go: function() {
      let self = this;
      this.botx.controller.hears(this.patterns, 'direct_message,direct_mention,mention', function(bot, message) {
        function loop(responses, index) {
          if (index >= responses.length) return;
          let fn = responses[index];
          fn(bot, message);
          setTimeout(() => {loop(responses, index+ 1)}, 500);
        }
        loop(self.responses, 0);
      });
    }
  }
}

function main() {
  let bot = botx();

  bot.whenBotHears('hi')
    .orBotHears('hello')
    .thenReply('Well, hello there...')
    .thenReply('How nice to see you again!')
    .go();

  bot.whenBotHears('say (.*)')
    .orBotHears('repeat (.*)')
    .thenReply('$1. I hope I said that right...')
    .go();

}

main();
