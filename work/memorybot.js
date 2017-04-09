'use strict';

const botx = require('../src/botx');

let bot = botx({
  help: {
    messages: [
      'I am a bot with a small memory...',
      'If you ask me "call me <something>", I will remember that name',
      'and use it when you say "hello" or "hi" to me.'
    ]
  }
});

let name = 'friend';

bot.log.notice("Starting a new BOTX...");

bot.when(/^call me (\w+)/)
  .then((b, message) => {
    name = message.match[1];
    b.reply(message, 'OK, from now on you are ' + name);
  })
  .go();

bot.when(/^hi/)
  .or(/^hello/)
  .then((b, m) => {
    b.reply(m, 'Well hi there, ' + name + '.');
  })
  .go();


bot.when(/^now/)
  .then((b,m) => {
    //const reply = `<!date^${m.ts}^It's {time} on {date}|Sorry, I can't work out what time it is...>`;
    b.reply(m, new Date().toString());
  })
  .go();