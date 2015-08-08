"use strict";

var Mocha = require('mocha');
 
new Mocha()
.ui('bdd')
.reporter('spec')
.addFile('./tests/basic')
.run();
