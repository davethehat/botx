'use strict';

if (!process.env.SLACK_API_TOKEN) {
  console.log('Error: Specify token in environment: SLACK_API_TOKEN');
  process.exit(1);
}

const botx = require('../src/botx');

main();

function main() {
  
  let bot = botx({
    token: process.env.SLACK_API_TOKEN
  });

  bot.when('^hi')
    .or('^hello')
    .thenSay('Well, hello there...')
    .thenSay('How nice to see you again!')
    .go();

  bot.when('^say (.+)')
    .or('^repeat (.+)')
    .thenSay('"$1"! I hope I said that right...')
    .go();

  let areWeGood = bot.conversation()
    .ask('Are we good?')
    .when('yes').thenSay('I\'m so glad we are friends!')
    .when('no').thenSay('Aww, and there I was hoping...')
    .otherwise('Well, maybe there\'s hope for me yet')
    .create();

  bot.when('^good')
    .thenStartConversation(areWeGood)
    .go();

  
  // This will be moved to another module, here for now
  
  bot.when('reddit search (.+)')
    .then(function(bot, message) {
      scrape.request('http://www.reddit.com/search?q=' + message.match[1] , function (err, $) {
        if (err) {
          console.error(err);
        }

        var div = $('div.search-result-link').first();
        var score = div.find('span.search-score').first();
        var link = div.find('a.search-title').first();
        
        bot.reply(message, link.text + ' (' + score.text + ') ' + link.attribs.href);
      });
    })
    .go();

  bot.when('reddit (hot|new|rising|controversial)')
    .then(function(bot, message) {
      scrape.request('http://www.reddit.com/' + message.match[1] , function (err, $) {
        if (err) {
          console.error(err);
        }

        var div = $('div.link').first();
        var score = div.find('div.score.unvoted').first();
        var link = div.find('a.title').first();

        bot.reply(message, link.text + ' (' + score.text + ') ' + link.attribs.href);
      });
    })
    .go();
}
