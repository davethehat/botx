# botx

Simple fluent wrapper for BotKit API. Developed over the Slack API, not tested on others. I will try to keep this non-target-specific!

The goal is to use this in an LCCM coding event for 6th-formers (25 April 2017), so it's got to be easy to grasp, set up, use and modify.

A simple example:

```javascript
'use strict';

const botx = require('../src/botx');

const bot = botx({
  help: {
    messages: [
      'I am but a simple bot...',
      'Say "hello" or "hi" to me, or',
      'ask me to say or repeat something.' 
    ]
  }
});

bot.start();

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

To use with Slack, you'll need to create a slack Bot user. Once you've done that, to run your bot directly from 
node you will need to place your Slack API token in the environment *SLACK_API_TOKEN*. Alternatively, copy the 
file `config/bot.template.js` to `config/bot.js`, and replace the template text in the file with your token, then 
run your bot using:

```
$ npm run bot <path-to-your-bot>
```

The workbook used in the workshop can be found in the `doc` directory: it includes all exercises, and instructions on 
setting up a Slack account and bot user, and creating a Cloud9 IDE account (used in the workshop, although you can of
course install node.js on your own computer and use your favourite editor/IDE as you wish).

