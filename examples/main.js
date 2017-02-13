
const botx = require('../src/botx');


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

  let areWeGood = bot.conversation()
    .ask('Are we good?')
    .when('yes').thenSay('I\'m so glad we are friends!')
    .when('no').thenSay('Aww, and there I was hoping...')
    .otherwise('Well, maybe there\'s hope for me yet')
    .create();

  bot.whenBotHears('good')
    .thenStartConversation(areWeGood)
    .go();




  bot.whenBotHears('reddit search (.+)')
    .then(function(bot, message) {
      scrape.request('http://www.reddit.com/search?q=' + message.match[1] , function (err, $) {
        if (err) {
          console.error(err);
        }

        var div = $('div.search-result-link').first();
        var score = div.find('span.search-score').first();
        var link = div.find('a.search-title').first();
        console.log();
        bot.reply(message, link.text + ' (' + score.text + ') ' + link.attribs.href);
      });
    })
    .go();

  bot.whenBotHears('reddit (hot|new|rising|controversial)')
    .then(function(bot, message) {
      scrape.request('http://www.reddit.com/' + message.match[1] , function (err, $) {
        if (err) {
          console.error(err);
        }

        var div = $('div.link').first();
        var score = div.find('div.score.unvoted').first();
        var link = div.find('a.title').first();
        console.log();
        bot.reply(message, link.text + ' (' + score.text + ') ' + link.attribs.href);
      });
    })
    .go();
}

main();
