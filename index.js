#!/usr/bin/env node

require = require('esm')(module);
require('./git-npx').cli(process.argv);