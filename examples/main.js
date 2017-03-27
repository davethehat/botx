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

    .ask('chilli?', 'meat_thread')
    .when('yes').thenSay('Hoooooooootttttttt!!!!!')
    .when('no').thenSay('Wuss!')
    .otherwise('I see you blow hot and cold...', 'meat_thread')

    .create();

  bot.when('pizza')
    .thenStartConversation(pizza)
    .go();

}
