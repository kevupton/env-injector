#!/usr/bin/env node

const { injectEnvs } = require('../dist/index.js');

injectEnvs(process.argv[2]);

