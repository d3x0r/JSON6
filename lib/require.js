'use strict';
// require.js
// Node.js only: adds a require() hook for .json6 files, just like the native
// hook for .json files.
//
// Usage:
// require('json6/require');
// require('./foo');    // will check foo.json5 after foo.js, foo.json, etc.
// require('./bar.json6');

const FS = require('fs');
const JSON6 = require('./json6');

// Modeled off of (v0.6.18 link; check latest too):
// https://github.com/joyent/node/blob/v0.6.18/lib/module.js#L468-L472

/**
 * @param {any} module
 * @param {string} filename
 * @returns {void}
 */
require.extensions['.json6'] = function (module, filename) {
	const content = FS.readFileSync(filename, 'utf8');
	module.exports = JSON6.parse(content);
};
