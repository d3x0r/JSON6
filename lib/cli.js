#!/usr/bin/env node
'use strict';

// cli.js
// JSON6 command-line interface.
//
// This is pretty minimal for now; just supports compiling files via `-c`.
// TODO More useful functionality, like output path, watch, etc.?

const FS = require('fs');
const JSON6 = require('./json6');
const Path = require('path');

const USAGE = [
	'Usage: json6 -c path/to/file.json6 ...',
	'Compiles JSON6 files into sibling JSON files with the same basenames.',
].join('\n');

// if valid, args look like [node, json6, -c, file1, file2, ...]
const args = process.argv;

if (args.length < 4 || args[2] !== '-c') {
	console.error(USAGE);
	process.exit(1);
}

const cwd = process.cwd();
const files = args.slice(3);

// iterate over each file and convert JSON6 files to JSON:
files.forEach(function (file) {
	const json6Path = Path.resolve(cwd, file);
	const basename = Path.basename(json6Path, '.json6');
	const dirname = Path.dirname(json6Path);

	const json6 = FS.readFileSync(json6Path, 'utf8');
	const obj = JSON6.parse(json6);
	const json = JSON.stringify(obj, null, 4) + '\n'; // 4 spaces; TODO configurable?

	const jsonPath = Path.join(dirname, basename + '.json');
	FS.writeFileSync(jsonPath, json, 'utf8');
});
