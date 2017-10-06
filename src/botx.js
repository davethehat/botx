'use strict';

const { merge } = require('lodash');

const DEFAULT_CONFIG = {
  name: 'BOTX bot',
  debug: true,
  require_delivery: true,
  stats_optout: true,
  error: 'Oh dear: {{error}}',
  shutdown: {
    trigger: 'shutdown',
    question: 'Are you sure?',
    onYes: 'Shutting down...',
    onNo: 'Continuing...'
  },
  help: {
    trigger: '^bot help',
    messages: ['I am a bot!']
  },
  adapter: 'slack'
};

module.exports = function botx(userConfig = {}) {
  const config = merge({}, DEFAULT_CONFIG, userConfig);
  const adapter = require(`./adapters/${config.adapter}`);
  return adapter.initialise(config);
};


