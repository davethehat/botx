'use strict';

module.exports = conversationResponse;

function conversationResponse(pattern, threadname, builder) {
  return {
    switchTo: function(newThreadname) {
      let f = (response, conv) => {
        conv.gotoThread(newThreadname);
      };
      return builder.addPatternAction(pattern, threadname, f);
    },

    then: function(fn) {
      return builder.addPatternAction(pattern, threadname, fn)
    },

    thenSay: function(s, action = 'next') {
      let f = (response, conv) => {
        conv.say(s);
        conv[action]();
      };
      return builder.addPatternAction(pattern, threadname, f)
    }
  }
}