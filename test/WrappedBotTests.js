'use strict';

const assert = require('assert');
const sinon = require('sinon');
const WrappedBot = require('../src/bot/WrappedBot');


describe('WrappedBot', () => {

  describe('start', () => {

    it('should call log', () => {
      const config = {
        name: 'unit-test-bot'
      };

      const log = { notice() {}};
      const mockLog = sinon.mock(log);

      mockLog.expects('notice').once();

      const bot = new WrappedBot(config, {log});
      bot.start();

      mockLog.verify();

    })
  });
});

