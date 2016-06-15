'use strict';

require('babel-register');

require('chai').should();
global.expect = require('chai');

global.sourceRoot = require('path').join(__dirname, '../src/');
process.env.NODE_PATH = global.sourceRoot;

require('module').Module._initPaths();
