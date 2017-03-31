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

  let areWeGood = bot.conversation()
    .ask('Are we good?')
    .when('yes').thenSay('I\'m so glad we are friends!')
    .when('no').thenSay('Aww, and there I was hoping...')
    .otherwise('Well, maybe there\'s hope for me yet')
    .create();

  bot.when('^good')
    .thenStartConversation(areWeGood)
    .go();
}
