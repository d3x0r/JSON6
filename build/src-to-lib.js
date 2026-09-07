'use strict';
// Generate lib/json6.js from src/json6.js.
//
// src/json6.js is the only hand-edited parser source.  Everything in lib/ and
// dist/ is a build product: this script writes lib/json6.js with the package
// version stamped into the `const version = "...";` line, plus a generated-file
// header.  rollup and tsc then derive dist/ from lib/.
//
// The version is read from package.json6 (the source of package.json) using
// the parser in src/ itself, so this step depends on nothing in lib/ and runs
// first in `npm run build`, before lib/cli.js regenerates package.json.
//
//   node build/src-to-lib.js             write lib/json6.js
//   node build/src-to-lib.js --check     exit 1 if lib/json6.js is stale (no write)

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const SRC = path.join(root, 'src', 'json6.js');
const DST = path.join(root, 'lib', 'json6.js');

const JSON6 = require(SRC);
const pkg = /** @type {{ version: string }} */ (JSON6.parse(fs.readFileSync(path.join(root, 'package.json6'), 'utf8')));
const src = fs.readFileSync(SRC, 'utf8');
const nl = src.includes('\r\n') ? '\r\n' : '\n';

const versionLine = /^const version = "[^"]*";$/m;
if (!versionLine.test(src)) {
	console.error('build/src-to-lib.js: could not find `const version = "...";` in src/json6.js');
	process.exit(1);
}

const header = [
	'// GENERATED FILE -- do not edit.',
	'// Built from src/json6.js by build/src-to-lib.js (npm run build); edits here are overwritten.',
	'',
].join(nl);

const out = header + src.replace(versionLine, `const version = "${pkg.version}";`);

if (process.argv.includes('--check')) {
	const cur = fs.existsSync(DST) ? fs.readFileSync(DST, 'utf8') : null;
	if (cur === out) { console.log('lib/json6.js is up to date.'); process.exit(0); }
	console.error('lib/json6.js is STALE -- run: node build/src-to-lib.js');
	process.exit(1);
}

fs.writeFileSync(DST, out);
console.log(`wrote lib/json6.js from src/json6.js (version ${pkg.version})`);
