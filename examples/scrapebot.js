'use strict';

if (!process.env.SLACK_API_TOKEN) {
  console.log('Error: Specify token in environment: SLACK_API_TOKEN');
  process.exit(1);
}

const botx = require('../src/botx');
const dig = require('../src/dig');

main();

function main() {
  
  let bot = botx({
    token: process.env.SLACK_API_TOKEN
  });
  
  bot.log.notice('Starting a new BOTX...');
  
  bot.when('help')
    .thenSay('I can search things for you!')
    .thenSay('Ask me using the following commands from the DIG library:')
    .thenSay('---- reddit ----')
    .thenSay('reddit search -something-')
    .thenSay('reddit (hot|new|rising|controversial)')
    .thenSay('---- twitter ----')
    .thenSay('twitter search -something-')
    .thenSay('twitter now')
    .thenSay('---- youtube ----')
    .thenSay('youtube search (.+)')
    .go();
  
  bot.when('^reddit search (.+)')
    .then((b, message) => {
      dig.reddit.search(message.match[1], (err, link) => {
        bot.linkOrBust(err, message, link);
      });
    })
    .go();

  bot.when('^reddit (hot|new|rising|controversial)')
    .then((b, message) => {
      dig.reddit.category(message.match[1], (err, link) => {
        bot.linkOrBust(err, message, link);
      });
    })
    .go();

  bot.when('^twitter now')
    .then((b, message) => {
      dig.twitter.category('moments', (err, link) => {
        bot.linkOrBust(err, message, link);
      });
    }).go();


  bot.when('^twitter search (.+)')
    .then((b, message) => {
      const q = match[1];
      dig.twitter.search(q, (err, link) => {
        bot.linkOrBust(err, message, link);
      });
    }).go();
  
  bot.when('^youtube search (.+)')
    .then((b, message) => {
      const q = match[1];
      dig.youtube.search(q, (err, link) => {
        bot.linkOrBust(err, message, link);
      });
    }).go();

}
