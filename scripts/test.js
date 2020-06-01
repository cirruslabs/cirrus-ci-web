'use strict';

process.env.BABEL_ENV = 'test';
process.env.NODE_ENV = 'test';
process.env.PUBLIC_URL = '';

process.on('unhandledRejection', err => {
  throw err;
});

require('../config/env');

const jest = require('jest');
let argv = process.argv.slice(2);

// Watch unless on CI or explicitly running all tests
if (!process.env.CI && argv.indexOf('--watchAll') === -1 && argv.indexOf('--watchAll=false') === -1) {
  argv.push('--watch');
}

jest.run(argv);
