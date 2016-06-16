'use strict';

// disable babel cache.
process.env.BABEL_DISABLE_CACHE = 1;

require('babel-register')({
  ignore: /node_modules(?![/]gdbots-common)/,

  plugins: [
    ['module-alias', [
      { src: './src', expose: 'gdbots/pbj' },
      { src: 'npm:gdbots-common/src', expose: 'gdbots' }
    ]]
  ]
});

require('chai').should();
global.expect = require('chai');
