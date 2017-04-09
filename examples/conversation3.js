'use strict';

const botx = require('../src/botx');

const bot = botx({
  help: {
    messages: [
      'I can capture your pizza order!',
      'If you say "pizza" I\'ll help you choose something.'
    ]
  }
});

bot.log.notice("Starting a new BOTX...");

const order = 'OK, got your order: {{responses.base}} {{responses.type}} pizza {{responses.toppings}} topping';

const pizza = bot.conversation()
  .ask('What sort?').into('type')     .when('.*') .switchTo('base')
  .ask('Thin or deep?', 'base')       .when('.*') .switchTo('toppings')
  .ask('Toppings?',     'toppings')   .when('.*') .thenSay(order)
  .create((responses) => console.log(responses));

bot.when('pizza')
  .thenStartConversation(pizza)
  .go();

