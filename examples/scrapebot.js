'use strict';

const botx = require('../src/botx');
const dig = require('../src/dig');

const bot = botx({
  name: 'Scrapebot',
  help: {
    messages: [
      'I can search things for you!',
      'Ask me using the following commands from the DIG library:',
      '---- reddit ----',
      'reddit search -something-',
      'reddit (hot|new|rising|controversial)',
      '---- twitter ----',
      'twitter search -something-',
      'twitter now',
      '---- youtube ----',
      'youtube search (.+)'
    ]
  }
});

bot.start();

bot.when('^reddit search (.+)')
  .thenCallWithOneMatch(dig.reddit.boundSearch, bot.link)
  .go();

bot.when('^reddit (hot|new|rising|controversial)')
  .thenCallWithOneMatch(dig.reddit.boundCategory, bot.link)
  .go();

bot.when('^youtube search (.+)')
  .thenCallWithOneMatch(dig.youtube.boundSearch, bot.link)
  .go();

bot.when('^twitter search (.+)')
  .thenCallWithOneMatch(dig.twitter.boundSearch, bot.link)
  .go();

bot.when('^twitter now')
  .thenCallWithOneMatch(dig.twitter.boundCategory, { match: 'moments', ok: bot.link, error: bot.error })
  .go();

