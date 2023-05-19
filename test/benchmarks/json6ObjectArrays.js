'use strict';

const { expect } = require( 'chai' );
const JSON6 = require( "../../" );
const parse = JSON6.parse;

// benchmark - needs some work; ended up somewhat divergent.
describe('Objects/Arrays benchmarks', function () {
	this.timeout(25000);
	it('Benchmark nested objects', function () {
		let start = Date.now();
		let result;
		for( let n = 0; n < 1000000; n++ ) {
			result = parse( "{\"a\":{\"b\":{\"c\":{\"d\":123}}}}" );
			//parse( '"Simple String Value."' );
		}
		let end = Date.now();
		console.log( "1m in ", end-start );
		expect(result).to.deep.equal({
			a: {b: {c: {d: 123}}}}
		);

		start = Date.now();
		for( let n = 0; n < 1000000; n++ ) {
			result = parse( "[1,[2,[3,[4,5]]]]" );
			//parse( '"Simple String Value."' );
		}
		end = Date.now();
		console.log( "1m in ", end-start );
		expect(result).to.deep.equal([1,[2,[3,[4,5]]]]);


		// var translations = ["{\"a\":{\"b\":{\"c\":{\"d\":123}}}}","{\"a\":{\"b\":{\"c\":{\"d\":123}}}}","{\"a\":{\"b\":{\"c\":{\"d\":123}}}}","{\"a\":{\"b\":{\"c\":{\"d\":123}}}}"];
		// var ntrans = 0;

		start = end;
		for( let n = 0; n < 5000000; n++ ) {
			result = JSON.parse( "{\"a\":{\"b\":{\"c\":{\"d\":123}}}}" );
			//JSON.parse( translations[ntrans] );
			//ntrans = (ntrans+1)&3;
		}
		end = Date.now();
		console.log( "1m in ", end-start );
		expect(result).to.deep.equal({
			a: {b: {c: {d: 123}}}
		});
	});
	it('Benchmark nested array', function () {
		const start = Date.now();
		let result;
		for( let n = 0; n < 5000000; n++ ) {
			result = JSON.parse( "[1,[2,[3,[4,5]]]]" );
			//parse( '"Simple String Value."' );
		}
		const end = Date.now();
		console.log( "1m in ", end-start );
		expect(result).to.deep.equal(
			[1, [2, [3, [4, 5]]]]
		);
	});
	// benchmark - needs some work; ended up somewhat divergent.
	it('Benchmark nested object with numeric keys', function () {
		const varObjects = [];
		for( let n = 0; n < 100000; n++ ) {
			varObjects.push(
				'{"a' + n + '":{"b' + n + '":{"c' + n + '":{"d' + n + '":123}}}}'
			);
		}

		/*
		var varStrings = [];
		for( var n = 0; n < 100000; n++ ) {
			varStrings.push( `"SImple STring Value ${n}"` );
		}

		var varNumbers = [];
		for( var n = 0; n < 100000; n++ ) {
			varNumbers.push( `${n}` );
		}
		*/


		let start = Date.now();
		for( let n = 0; n < 500000; n++ ) {
			parse( varObjects[n % 100000] );
			// parse( varStrings[n%100000] );
			// parse( varNumbers[n%100000] );
			// parse( "{\"a\":{\"b\":{\"c\":{\"d\":123}}}}" );
			// parse( '"Simple String value"' );
			// parse( '123456789' );
		}

		let end = Date.now();
		console.log( "1m in ", end-start );


		start = end;
		for( let n = 0; n < 500000; n++ ) {
			JSON.parse( varObjects[n % 100000] );
			// JSON.parse( varStrings[n%100000] );
			// JSON.parse( varNumbers[n%100000] );
			/* JSON.parse( "{\"a\":{\"b\":{\"c\":{\"d\":123}}}}" );*/
			// JSON.parse( '"Simple String value"' );
			// JSON.parse( '123456789' );
		}
		end = Date.now();
		console.log( "1m in ", end - start );
		expect(true).to.be.true;
	});
});
