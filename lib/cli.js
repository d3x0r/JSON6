#!/usr/bin/env node

// cli.js
// JSON6 command-line interface.
//
// This is pretty minimal for now; just supports compiling files via `-c`.
// TODO More useful functionality, like output path, watch, etc.?

var FS = require('fs');
var JSON6 = require('./json6');
var Path = require('path');

var USAGE = [
    'Usage: json6 -c path/to/file.json6 ...',
    'Compiles JSON6 files into sibling JSON files with the same basenames.',
].join('\n');

// if valid, args look like [node, json6, -c, file1, file2, ...]
var args = process.argv;

if (args.length < 4 || args[2] !== '-c') {
    console.error(USAGE);
    process.exit(1);
}

var cwd = process.cwd();
var files = args.slice(3);

// iterate over each file and convert JSON6 files to JSON:
files.forEach(function (file) {
    var path = Path.resolve(cwd, file);
    var basename = Path.basename(path, '.json6');
    var dirname = Path.dirname(path);

    var json6 = FS.readFileSync(path, 'utf8');
    var obj = JSON6.parse(json6);
    var json = JSON.stringify(obj, null, 4); // 4 spaces; TODO configurable?

    path = Path.join(dirname, basename + '.json');
    FS.writeFileSync(path, json, 'utf8');
});
