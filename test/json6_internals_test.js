/* eslint-disable no-useless-assignment -- Temporary */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { expect } = require( 'chai' );
const JSON6 = require( ".." );

/**
 * @typedef {object} InstrumentedJSON6
 * @property {(value: unknown, msg?: string) => unknown} __debugEnsureDefined
 * @property {() => { __debugContextStack: { pop: () => unknown } }} begin
 */

/**
 * @returns {InstrumentedJSON6}
 */
function loadInstrumentedJSON6() {
	const sourcePath = path.join(__dirname, '..', 'lib', 'json6.js');
	const source = fs.readFileSync(sourcePath, 'utf8');
	const instrumented = source
		.replace(
			'const JSON6 = {};',
			'const JSON6 = {};\nJSON6.__debugEnsureDefined = ensureDefined;'
		)
		.replace(
			"return {\n\t\tfinalError() {",
			"return {\n\t\t__debugContextStack: context_stack,\n\t\tfinalError() {"
		);
	const sandbox = {
		require,
		console,
		module: { exports: {} },
		exports: {},
		__dirname: path.join(__dirname, '..'),
		__filename: sourcePath,
	};
	vm.runInNewContext(instrumented + '\n;module.exports = JSON6;', sandbox);
	return /** @type {InstrumentedJSON6} */ (sandbox.module.exports);
}

// this is more about coverage than failure/success.
// internally there can be multiple outstanding buffer segments to process, this just makes sure we can do that.
// Failure is any thrown error.

describe('JSON6.streaming.internal', function () {
	it('requeues input buffers for pending inputs', function () {
		const results = [];
		const parser = JSON6.begin();
		let parseResult;

		parseResult = parser._write( "1 2 3 " );
		results.push( parseResult );
		results.push( parser.value() );

		parseResult = parser._write( "1 2 3 4 5 " );
		results.push( parseResult );
		results.push( parser.value() );

		parseResult = parser._write( "1 2 3 " );
		parseResult = parser._write();
		results.push( parseResult );
		results.push( parser.value() );

		while( (parseResult = parser._write()) ) {
			//console.log( "Leftover Data:", parser.value() );
		}

		// and now, there will be a 'saved' which push() can pull from.
		parseResult = parser._write( "1 " );
		//console.log( "Leftover Data:", parser.value() );


		expect(results.join(",")).to.equal("2,1,2,2,1,3");
	});

	it('returns -1 from _write when the parser is already in an error state', function () {
		const parser = JSON6.begin();
		let threw = false;
		try {
			parser._write(",");
		} catch {
			threw = true;
		}
		expect(threw).to.equal(true);
		expect(parser._write()).to.equal(-1);
	});

	it('clears incomplete-string state across reset', function () {
		const parser = JSON6.begin();
		parser._write('"split');
		parser.reset();
		expect(parser._write('"fresh"')).to.equal(1);
		expect(parser.value()).to.equal('fresh');
	});

	it('rejects undefined values passed to ensureDefined', function () {
		const instrumentedJSON6 = loadInstrumentedJSON6();
		expect(function () {
			instrumentedJSON6.__debugEnsureDefined(undefined, 'missing value');
		}).to.throw('missing value');
	});

	it('rejects popping an empty context stack', function () {
		const instrumentedJSON6 = loadInstrumentedJSON6();
		const parser = instrumentedJSON6.begin();
		let errorMessage;
		try {
			parser.__debugContextStack.pop();
		} catch (error) {
			// Not `instanceof Error`: this throws from inside a separate vm realm,
			// whose Error constructor differs from this file's.
			errorMessage = /** @type {{ message: string }} */ (error).message;
		}
		expect(errorMessage).to.equal('context stack underflow');
	});
});
