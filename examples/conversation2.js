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


  bot.log.notice("Starting a new BOTX...");

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

}
