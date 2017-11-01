'use strict';

const fs = require('fs');
const botx = require('../src/botx');

const bot = botx({
  name: 'Feedback bot',
  help: {
    messages: [
      'I\'m the feedback bot for this event!',
      'My creators are very interested in hearing how you found this workshop',
      'I\'ll ask you ~20 questions and it should take no longer than 5-7 minutes'
    ]
  }
});

bot.start();

const feedbackP1 = bot.conversation()
  .ask('Whats your name?').into('name').when('.*').switchTo('email')
  .ask('Whats your email?', 'email').when('.*').switchTo('contactAboutWorkshop')
  .ask('Could we contact you in future about this workshop?', 'contactAboutWorkshop').when('.*').switchTo('contactAboutLCCM')
  .ask('Could we contact you in future about the LCCM DPD course?', 'contactAboutLCCM').when('.*').switchTo('enjoyedSelf')
  .ask(`On a scale of 1 - 5, where 1 = *not at all* 5 = *had a great time!*
> Did you enjoy yourself this evening? (1-5)`, 'enjoyedSelf').when('.*').switchTo('didLearn')

  .ask(`On a scale of 1 - 5, where 1 = *not much* 5 = *learned a lot!*
> How much did you learn? (1-5)`, 'didLearn').when('.*').switchTo('wellLed')

  .ask(`On a scale of 1 - 5, where 1 = *poorly* 5 = *brilliantly*
> How well-led was the workshop? (1-5)`, 'wellLed').when('.*').switchTo('difficulty')

  .ask(`On a scale of 1 - 5, where 1 = *too easy* 5 = *too hard*
> How difficult did you find the tasks and challenges? (1-5)`, 'difficulty').when('.*').switchTo('workbookClarity')

  .ask(`On a scale of 1 - 5, where 1 = *hard to follow* 5 = *easy to follow*
> How clear was the workbook? (1-5)`, 'workbookClarity').when('.*').switchTo('instructionsClarity')

  .ask(`On a scale of 1 - 5, where 1 = *hard to follow* 5 = *easy to follow*
> How clear were the overall instructions for the workshop? (1-5)`, 'instructionsClarity').when('.*').switchTo('wifi')

  .ask(`On a scale of 1 - 5, where 1 = *poor* 5 = *fine*
> How was the wifi? (1-5)`, 'wifi').when('.*').switchTo('foodDrink')

  .ask(`On a scale of 1 - 5, where 1 = *poor* 5 = *good*
> How was the food/drink? (1-5)`, 'foodDrink').when('.*').switchTo('recommend')

  .ask(`On a scale of 1 - 5, where 1 = *not at all* 5 = *had a great time!*
> How likely are you to recommend the workshop to a friend? (1-5)`, 'recommend').when('.*').switchTo('lccmFindOutMore')

  .ask(`On a scale of 1 - 5, where 1 = *no* 5 = *yes*
> Does the workshop encourage you to find out more about LCCM and the DPD BSc? (1-5)`, 'lccmFindOutMore').when('.*').switchTo('tellFriends')

  .ask(`On a scale of 1 - 5, where 1 = *not at all* 5 = *very*
> How likely are you to tell friends about LCCM and the DPD BSc? (1-5)`, 'tellFriends').when('.*').switchTo('likedMost')
  .ask('What did you like most?', 'likedMost').when('.*').switchTo('likedLeast')
  .ask('What did you like least?', 'likedLeast').when('.*').switchTo('makingWorkshopBetter')
  .ask('What can we do to make the workshop better?', 'makingWorkshopBetter').when('.*').switchTo('otherFeedback')
  .ask('Any other feedback?', 'otherFeedback').when('.*').thenSay(`Thank you so much for taking the time to provide feedback! We hope you have a safe journey home :)`)

  .create((responses) => {
    console.log(responses);
    let stamp = new Date().getTime();
    fs.writeFile(`./feedback-${stamp}.json`, JSON.stringify(responses, null, 2), (error) => {console.log(error)});
  });

bot.when('.*')
  .thenSay(`Howdy! I'm the feedback bot for this event!
My creators are very interested in hearing how you found this workshop
If you don't mind, I'll ask you ~20 simple questions and it should take you no longer than 5-7 minutes

Lets get going!
--------------------------
`)
  .thenStartConversation(feedbackP1)
  .go();