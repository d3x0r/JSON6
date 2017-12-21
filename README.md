# JSON6 – JSON for Humans
[![Join the chat at https://gitter.im/sack-vfs/json6](https://badges.gitter.im/sack-vfs/json6.svg)](https://gitter.im/sack-vfs/json6?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

*Documenation base cloned from JSON5 project https://github.com/json5/json5*

JSON is an excellent data format, but thought to be better.

**JSON6 is a proposed extension to JSON** that aims to make it easier for
*humans to write and maintain* by hand. It does this by adding some minimal
syntax features directly from ECMAScript 6.

JSON6 is a **superset of JavaScript**, although adds **no new data types**,
and **works with all existing JSON content**. Some features allowed in JSON6
are not directly supported by Javascript; although all javascript parsable
features can be used in JSON6, except functions or any other code construct, 
transporting only data save as JSON.

JSON6 is *not* an official successor to JSON, and JSON6 content may *not*
work with existing JSON parsers. For this reason, JSON6 files use a new .json6
extension. *(TODO: new MIME type needed too.)*

The code is a **reference JavaScript implementation** for both Node.js
and all browsers. It is a completly new implementation.

## Why

JSON isn’t the friendliest to *write*. Keys need to be quoted, objects and
arrays can’t have trailing commas, and comments aren’t allowed — even though
none of these are the case with regular JavaScript today.

That was fine when JSON’s goal was to be a great data format, but JSON’s usage
has expanded beyond *machines*. JSON is now used for writing [configs][ex1],
[manifests][ex2], even [tests][ex3] — all by *humans*.

[ex1]: http://plovr.com/docs.html
[ex2]: https://www.npmjs.org/doc/files/package.json.html
[ex3]: http://code.google.com/p/fuzztester/wiki/JSONFileFormat

There are other formats that are human-friendlier, like YAML, but changing
from JSON to a completely different format is undesirable in many cases.
JSON6’s aim is to remain close to JSON and JavaScript.


## Features

The following is the exact list of additions to JSON’s syntax introduced by
JSON6. **All of these are optional**, and **MOST of these come from ES5/6**.

## Caveats

Does not include stringify, instead falling back to original JSON.stringify.
This will cause problems maintaining undefined, Infinity and NaN type values.

### Summary of Changes from JSON5

  - Keyword undefined
  - Objects/Strings back-tick quoted strings (no template support, just quotes); Object key names can be unquoted.
  - Strings - generous multiline string definition; all javascript character escapes work. \(\x##, \0###, \u####, \u\{\} \)
  - Numbers - underscore digit separation in numbers, octal and binary formats; all javascript number notations.
Addtionally support leading 0 to interpret as octal as C, C++ and other languages support.
  - Arrays - empty members
  - Streaming reader interface
  - (Twice the speed of JSON5; subjective)

### Objects

- Object keys can be unquoted if they do not have ':', ']', '[', '{', '}', ',', any quote or whitespace.

- Object keys can be single-quoted, (**JSON6**) or back-tick quoted; any valid string 

- Object keys can be double-quoted (original JSON).

- Objects can have a single trailing comma. Excessive commas in objects will cause an exception. '{ a:123,,b:456 }' is invalid.

[mdn_variables]: https://developer.mozilla.org/en/Core_JavaScript_1.5_Guide/Core_Language_Features#Variables

### Arrays

- Arrays can have trailing commas. If more than 1 is found, additional empty elements will be added.

- (**JSON6**) Arrays can have comma ( ['test',,,'one'] ), which will result with empty values in the empty places.

### Strings

- Strings can be double-quoted (as per original JSON).

- Strings can be single-quoted.

- Strings can be back-tick (\`) ([grave accent](https://en.wikipedia.org/wiki/Grave_accent)) -quoted.

- Strings can be split across multiple lines; just prefix each newline with a
  backslash. [ES5 [§7.8.4](http://es5.github.com/#x7.8.4)]

- (**JSON6**) all strings will continue keeping every character between the start and end, this allows multi-line strings 
  and keep the newlines in the string; if you do not want the newlines they can be escaped as previously mentioned.

### Numbers

- (**JSON6**) Numbers can have underscores separating digits '_' these are treated as zero-width-non-breaking-space. ([Proposal](https://github.com/tc39/proposal-numeric-separator) with the exception that _ can preceed or follow . and may be trailing.)

- Numbers can be hexadecimal (base 16).  ( 0x prefix )

- (**JSON6**) Numbers can be binary (base 2).  (0b prefix)

- (**JSON6**) Numbers can be octal (base 8).  (0o prefix)

- (**JSON6**) Numbers can be octal (base 8).  (0 prefix followed by more numbers, without a decimal)

- Numbers can begin or end with a (leading or trailing) decimal point.

- Numbers can include `Infinity`, `-Infinity`,  `NaN`, and `-NaN`.

- Numbers can begin with an explicit plus sign.

- Numbers can begin with multiple minus signs. For example '----123' === 123.

### Keyword Values

- (**JSON6**) supports 'undefined' in addition to 'true', 'false', 'null'.


### Comments

- Both inline (single-line using '//' (todo:or '#'?) ) and block (multi-line using \/\* \*\/ ) comments are allowed.


## Example

The following is a contrived example, but it illustrates most of the features:

```js
{
    foo: 'bar',
    while: true,
    nothing : undefined, // why not?

    this: 'is a \
multi-line string',

    thisAlso: 'is a
multi-line string; but keeps newline',

    // this is an inline comment
    here: 'is another', // inline comment

    /* this is a block comment
       that continues on another line */

    hex: 0xDEAD_beef,
    binary: 0b0110_1001,
    decimal: 123_456_789,
    octal: 0123,
    half: .5,
    delta: +10,
    negative : ---123,
    to: Infinity,   // and beyond!

    finally: 'a trailing comma',
    oh: [
        "we shouldn't forget",
        'arrays can have',
        'trailing commas too',
    ],
}
```

This implementation’s own [package.JSON6](package.JSON6) is more realistic:

```js
// This file is written in JSON6 syntax, naturally, but npm needs a regular
// JSON file, so compile via `npm run build`. Be sure to keep both in sync!

{
    name: 'JSON6',
    version: '0.1.105',
    description: 'JSON for the ES6 era.',
    keywords: ['json', 'es6'],
    author: 'd3x0r <d3x0r@github.com>',
    contributors: [
        // TODO: Should we remove this section in favor of GitHub's list?
        // https://github.com/d3x0r/JSON6/contributors
    ],
    main: 'lib/JSON6.js',
    bin: 'lib/cli.js',
    files: ["lib/"],
    dependencies: {},
    devDependencies: {
        gulp: "^3.9.1",
        'gulp-jshint': "^2.0.0",
        jshint: "^2.9.1",
        'jshint-stylish': "^2.1.0",
        mocha: "^2.4.5"
    },
    scripts: {
        build: 'node ./lib/cli.js -c package.JSON6',
        test: 'mocha --ui exports --reporter spec',
            // TODO: Would it be better to define these in a mocha.opts file?
    },
    homepage: 'http://github.com/d3x0r/JSON6/',
    license: 'MIT',
    repository: {
        type: 'git',
        url: 'https://github.com/d3x0r/JSON6',
    },
}
```


## Community

Join the [Google Group](http://groups.google.com/group/JSON6) if you’re
interested in JSON6 news, updates, and general discussion.
Don’t worry, it’s very low-traffic.

The [GitHub wiki](https://github.com/d3x0r/JSON6/wiki) (will be) a good place to track
JSON6 support and usage. Contribute freely there!

[GitHub Issues](https://github.com/d3x0r/JSON6/issues) is the place to
formally propose feature requests and report bugs. Questions and general
feedback are better directed at the Google Group.


## Usage

This JavaScript implementation of JSON6 simply provides a `JSON6` object just
like the native ES5 `JSON` object.

To use from Node:

```sh
npm install json-6
```

```js
var JSON6 = require('json6');
```

To use in the browser (adds the `JSON6` object to the global namespace):

```html
<script src="node_modules/json-6/lib/json6.js"></script>
```

Then in both cases, you can simply replace native `JSON` calls with `JSON6`:

```js
var obj = JSON6.parse('{unquoted:"key",trailing:"comma",}');
var str = JSON6.stringify(obj); /* uses JSON stringify, so don't have to replace */
```

|JSON6 Methods | parameters | Description |
|-----|-----|-----|
|parse| (string [,reviver]) | supports all of the JSON6 features listed above, as well as the native [`reviver` argument][json-parse]. |
|stringify | ( value ) | converts object to JSON.  [stringify][json-stringify] |
|escape | ( string ) | substitutes ", \, ', and ` with backslashed sequences. (prevent 'JSON injection') |
|begin| (cb [,reviver] ) | create a JSON6 stream processor.  cb is called with (value) for each value decoded from input given with write().  Optional reviver is called with each object before being passed to callback. |


[json-parse]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse
[json-stringify]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify

### JSON6 Streaming

A Parser that returns objects as they are encountered in a stream can be created.  `JSON.begin( dataCallback, reviver );`  The callback is called for each complete object in a stream of data that is passed.  

`JSON6.begin( cb, reviver )` returns an object with a few methods.

| Method | Arguments | Description | 
|:---|:---|:---|
| write | (string) | Parse string passed and as objects are found, invoke the callback passed to `begin()` Objects are passed through optional reviver function passed to `begin()`. |
| \_write | (string,completeAtEnd) | Low level routine used internally.  This does the work of parsing the passed string. Returns 0 if no object completed, 1 if there is no more data, and an object was completd, returns 2 if there is more data and a parsed object is found.  if completedAtEnd is true, dangling values are returned, for example "1234" isn't known to be completed, more of the number might follow in another buffer; if completeAtEnd is passed, this iwll return as number 1234.  Passing empty arguments steps to the next buffered input value. |
| value | () | Returns the currently completed object.  Used to get the completed object after calling \_write. |
| reset | () | If `write()` or `\_write()` throws an exception, no further objects will be parsed becuase internal status is false, this resets the internal status to allow continuing using the existing parser.  ( May require some work to actually work for complex cases) |


```js
   // This is (basically) the internal loop that write() uses.
   var result
   for( result = this._write(msg,false); result > 0; result = this._write() ) {
      var obj = this.value();
      // call reviver with (obj)
      // call callback with (obj)
   }
```

```js
// Example code using write
function dataCallback( value ) {
	console.log( "Value from stream:", value );
}
var parser = JSON.begin( dataCallback );

parser.write( '"Hello ' );   // a broken simple value string, results as 'Hello World!' 
parser.write( 'World!"' );
parser.write( '{ first: 1,' );   // a broken structure
parser.write( ' second : 2 }' );
parser.write( '[1234,12');  // a broken array across a value
parser.write( '34,1234]'); 
parser.write( '1234 456 789 123 523');  // multiple single simple values that are numbers
parser.write( '{a:1} {b:2} {c:3}');  // multiple objects

parser.write( '1234' );  // this won't return immediately, there might be more numeric data.
parser.write( '' ); // flush any pending numbers; if an object or array or string was split, throws an error; missing close.

parser.write( '1234' ); 
parser.write( '5678 ' );  // at this point, the space will flush the number value '12345678' 

```



### Extras

If you’re running this on Node, you can also register a JSON6 `require()` hook
to let you `require()` `.json6` files just like you can `.json` files:

```js
require('JSON-6/lib/require');
require('./path/to/foo');   // tries foo.json6 after foo.js, foo.json, etc.
require('./path/to/bar.json6');
```

This module also provides a `json6` executable (requires Node) for converting
JSON6 files to JSON:

```sh
json6 -c path/to/foo.json6    # generates path/to/foo.json
```

## Other Implementations

This is also implemented as part of npm [sack.vfs https://www.npmjs.com/package/sack.vfs] 
as a native code node.js addon.  This native javascript version allows usage in browsers.

## Benchmarks

This is as fast as the javascript version of Douglas Crockford's reference implementation [JSON
implementation][json_parse.js] for JSON parsing.  

This is nearly double the speed of [JSON5 http://json5.org] implementation that inspired this (which is half the speed of Crockford's reference implementation).

This is half the speed of the sack.vfs native C++ node addon implementation (which itself is half the speed of V8's native code implementation, but they can cheat and build strings directly).



## Development

```sh
git clone https://github.com/d3x0r/json6
cd json6
npm install
npm test
```

As the `package.json6` file states, be sure to run `npm run build` on changes
to `package.json6`, since npm requires `package.json`.

Feel free to [file issues](https://github.com/d3x0r/json6/issues) and submit
[pull requests](https://github.com/d3x0r/JSON6/pulls) — contributions are
welcome. If you do submit a pull request, please be sure to add or update the
tests, and ensure that `npm test` continues to pass.


## Changelog
- 0.1.127 - Fix bad shift/unshift/pop methods.
- 0.1.126 - Fix handling very wide characters.  Improved number parsing speed.  Fix string character escapes.  Update documentation to include '0o' prefix for numbers.
- 0.1.125 - Fix some `let`s that were causing deoptimization
- 0.1.123 - Fix `npm install json-6` in readme.  Remove dev dependancies that aren't used.  Fix #8 Wierd arrays [test](./tests/json6TestObjectArray.js)
- 0.1.122 - Fix referencing `val.negative` that should be just `negative`.
- 0.1.121 - Optimization; use `Number()` instead of `new Number()`
- 0.1.120 - If a non-string is passed to parse, convert to a string using String(msg).
- 0.1.119 - standardize errors; fix negative sign for -Infinity.
- 0.1.118 - Fix "use strict" undefined variables string_status and exponent_digit. Issue #4.
- 0.1.117 - documentation and license updates. (Issue #3)
- 0.1.116 - Updated docs; Fixed stream parse issue with numbers.
- 0.1.115 - Fix object key names with spaces being accepted.  Fix number parsing to be more strict.
- 0.1.114 - Fix true/false values.
- 0.1.113 - documentation update fix.
- 0.1.112 - fix streaming error at end of string, and values in some circumstances.
- 0.1.111 - fix packaging error.
- 0.1.110 - fix empty elements in arrays.  `[,]` = `[<empty item>]` not `[undefined]`. improve test.
- 0.1.109 - fix redundant result with certain buffers.
- 0.1.108 - rename 'add' to 'write' for compatibilty with other sack.vfs JSON6 parser.
- 0.1.107 - fix variable used for gathering Strings that caused permanent error
- 0.1.106 - fix handling whitespace after keyword
- 0.1.105 - Add a streaming interface.
- 0.1.104 - Readme updates. 
- 0.1.103 - Add underscore as a zero-space-non-breaking-whitespace for numbers.


## License

MIT. See [LICENSE.md](./LICENSE.md) for details.


## Credits

(http://github.com/json5/json5)  Inspring this project.

[json_parse.js]: https://github.com/douglascrockford/JSON-js/blob/master/json_parse.js
