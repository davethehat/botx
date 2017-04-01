'use strict';

const botx = require('../src/botx');

let bot = botx({
  help: {
    messages: [
      'I\'m a slightly insecure bot...',
      'I respond to "good" - please be nice to me!'
    ]
  }
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
