'use strict';

const assert = require('assert');

const WrappedBot = require('../src/bot/WrappedBot');

function beforeEach() {

}

function shouldCallLogOnStart() {

  const config = {
    name: 'unit-test-bot'
  };

  const mockAdapter = {
    lastNoticeMessage: '',
    log : {
      notice(message) {
        this.lastNoticeMessage = message;
      }
    }
  };

  const bot = new WrappedBot(config, mockAdapter);
  bot.start();

  assert.ok(mockAdapter.lastNoticeMessage.match(new RegExp(`${config.name}`)));
}

function shouldInstallShutdownConversationIfPresent() {
  const config = {
    name: 'unit-test-bot',
    shutdown: {
      trigger: 'shutdown',
      question: 'Are you sure?',
      onYes: 'Shutting down...',
      onNo: 'Continuing...'
    }
  };

}



function runTests() {
  shouldCallLogOnStart();
}

runTests();


