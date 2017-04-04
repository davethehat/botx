'use strict';

const botx = require('../src/botx');

const bot = botx({
  help: {
    messages: [
      'Let\'s talk about pizza!',
      'I respond to "pizza", and will comment on your preferences.'
    ]
  }
});


bot.log.notice("Starting a new BOTX...");

const pizza = bot.conversation()
  .ask('Meat or veg?')
  .when('meat').switchTo('meat')
  .when('veg').switchTo('veg')

  .ask('cheese?', 'veg')
  .when('yes').thenSay('Yay, cheese')
  .when('no').thenSay('What, pizza without cheese? Sheesh...')

  .ask('beef or ham?', 'meat')
  .when('beef').thenSay('Moooooooooo')
  .when('ham').thenSay('At least, no pineapple..')
  .create();

bot.when('^pizza')
  .thenStartConversation(pizza)
  .go();
