# botx

Simple fluent wrapper for BotKit API. Developed over the Slack API, not tested on others. I will try to keep this non-target-specific!

The goal is to use this in an LCCM coding event for 6th-formers (25 April 2017), so it's got to be easy to grasp, set up, use and modify.

A simple example:

```javascript
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

```

That's all it takes...

Note you will need to place your Slack API token in the environment *SLACK_API_TOKEN*

