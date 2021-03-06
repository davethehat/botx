'use strict';

const botx = require('../src/botx');

const bot = botx({
  name: 'MemoryBot',
  help: {
    messages: [
      'I am a bot with a small memory...',
      'If you ask me "call me <something>", I will remember that name',
      'and use it when you say "hello" or "hi" to me.'
    ]
  }
});

bot.start();

let name = 'friend';

bot.when(/^call me (\w+)/)
  .then((b, message) => {
    name = message.match[1];
    b.reply(message, 'OK, from now on you are ' + name);
  })
  .go();

bot.when(/^hi/)
  .or(/^hello/)
  .then((b, m) => {
    b.reply(m, `Well hi there, ${name}.`);
  })
  .go();
