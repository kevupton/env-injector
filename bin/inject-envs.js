#!/usr/bin/env node

const { injectEnvs } = require('../dist/inject-envs.js');

injectEnvs(process.argv[2], process.argv[3] === '-d');
