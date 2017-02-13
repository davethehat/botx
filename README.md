# botx

Simple fluent wrapper for BotKit API. Developed over the Slack API, not tested on others. I will try to keep this non-target-specific!

The goal is to use this in an LCCM coding event for 6th-formers, so it's got top be easy to grasp, set up, use and modify.

A simple example:

```javascript
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

  bot.when('^hi')
    .or('^hello')
    .thenSay('Well, hello there...')
    .thenSay('How nice to see you again!')
    .go();

  bot.when('^say (.+)')
    .or('^repeat (.+)')
    .thenSay('"$1"! I hope I said that right...')
    .go();

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
```

That's all it takes...
