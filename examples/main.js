'use strict';

if (!process.env.SLACK_API_TOKEN) {
  console.log('Error: Specify token in environment: SLACK_API_TOKEN');
  process.exit(1);
}

const botx = require('../src/botx');
const dig = require('../src/dig');

main();

function main() {
  
  let bot = botx({
    token: process.env.SLACK_API_TOKEN
  });


  bot.log.notice("Starting a new BOTX...");
  // bot.log.info
  // bot.log.error

  bot.when('^help')
    .thenSay('I can seach things for you!');


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


  const pizza = bot.conversation()
    .ask('Meat or veg?')
    .when('meat').switchTo('meat_thread')
    .when('veg').switchTo('veg_thread')

    .ask('cheese?', 'veg_thread')
    .when('yes').thenSay('Yay, cheese')
    .when('no').thenSay('What, pizza without cheese? Sheesh...')

    .ask('beef or ham?', 'meat_thread')
    .when('beef').thenSay('Moooooooooo')
    .when('ham').thenSay('At least, no pineapple..')

    .create();

  bot.when('pizza')
    .thenStartConversation(pizza)
    .go();



  bot.when('^reddit search (.+)')
    .then((b, message) => {
      dig.reddit.search(message.match[1], (err, link) => {
        bot.linkOrBust(err, message, link);
      });
    })
    .go();

  bot.when('^reddit (hot|new|rising|controversial)')
    .then((b, message) => {
      dig.reddit.category(message.match[1], (err, link) => {
        bot.linkOrBust(err, message, link);
      });
    })
    .go();

  bot.when('^twitter now')
    .then((b, message) => {
      dig.twitter.category('moments', (err, link) => {
        bot.linkOrBust(err, message, link);
      });
    }).go();


  bot.when('^twitter search (.+)')
    .then((b, message) => {
      const q = match[1];
      dig.twitter.search(q, (err, link) => {
        bot.linkOrBust(err, message, link);
      });
    }).go();

}
