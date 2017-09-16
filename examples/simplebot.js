'use strict';

const botx = require('../src/botx');

const bot = botx({
  name: 'Simplebot',
  help: {
    messages: [
      'I am but a simple bot...',
      'Say "hello" or "hi" to me, or',
      'ask me to say or repeat something.' 
    ]
  }
});

bot.when('^hi')
  .or('^hello')
  .thenSay('Well, hello there...')
  .thenSay(['How nice to see you again!','It\'s been a while!','What are you doing around these parts?'])
  .go();

bot.when('^say (.+)')
  .or('^repeat (.+)')
  .thenSay('"{{1}}"! I hope I said that right...')
  .go();
