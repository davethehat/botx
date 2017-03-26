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

  bot.when('^help')
    .thenSay('I am but a simple bot...')
    .thenSay('Say "hello" or "hi" to me, or')
    .thenSay('ask me to say or repeat something.')
    .go();

  bot.when('^hi')
    .or('^hello')
    .thenSay('Well, hello there...')
    .thenSay('How nice to see you again!')
    .go();

  bot.when('^say (.+)')
    .or('^repeat (.+)')
    .thenSay('"$1"! I hope I said that right...')
    .go();
}
