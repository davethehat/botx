'use strict';

if (!process.env.SLACK_API_TOKEN) {
  console.log('Error: Specify token in environment: SLACK_API_TOKEN');
  process.exit(1);
}

const botx = require('../src/botx');
const util = require("util");

main();

function main() {

  let bot = botx({
    token: process.env.SLACK_API_TOKEN
  });


  bot.log.notice("Starting a new BOTX...");
  
  const pizza = bot.conversation()
    .ask('What sort?', 'default').into('type').when('.*').switchTo('base')
    .ask('Thin or deep?', 'base').into('base').when('.*').switchTo('toppings')
    .ask('Toppings?', 'toppings').into('toppings').when('.*')
    .thenSay('OK, got your order: {{responses.base}} {{responses.type}} pizza with {{responses.toppings}} topping')
    .afterwards(conv => {
      const results = conv.extractResponses();
      bot.log(util.inspect(results));
    })
    .create();

  bot.when('pizza')
    .thenStartConversation(pizza)
    .go();

}

