'use strict';

const botx = require('../src/botx');

const bot = botx({
  name: 'Needybot',
  help: {
    messages: [
      'I\'m a slightly needy bot...',
      'I respond to "good" - please be nice to me!'
    ]
  }
});

bot.start();

const areWeGood = bot.conversation()
  .ask('Are we good?')
  .when('yes').thenSay('I\'m so glad we are friends!')
  .when('no').thenSay(['Aww, and there I was hoping...','Oh dear, that makes me sad...'])
  .otherwise('Well, maybe there\'s hope for me yet')
  .create();

bot.when('^good')
  .thenStartConversation(areWeGood)
  .go();
