'use strict';

const botx = require('../src/botx');

let bot = botx({
  help: {
    messages: [
      'I am but a simple bot...',
      'Say "hello" or "hi" to me, or',
      'ask me to say or repeat something.' 
    ]
  }
});

bot.log.notice("Starting a new BOTX...");

bot.when('^hi')
  .or('^hello')
  .thenSay('Well, hello there...')
  .thenSay('How nice to see you again!')
  .go();

bot.when('^say (.+)')
  .or('^repeat (.+)')
  .thenSay('"{{1}}"! I hope I said that right...')
  .go();
