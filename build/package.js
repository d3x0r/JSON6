'use strict';
const fs = require('fs');
const path = require('path');

const JSON5 = require('../lib');

const pkg = require('../package.json');

const pkg5 = `// This is a generated file. Do not edit.
${JSON5.stringify(pkg, null, 2)}
`;

fs.writeFileSync(path.resolve(__dirname, '..', 'package.json5'), pkg5);
