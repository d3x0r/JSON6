'use strict';
const { expect } = require( 'chai' );
// var sack = require( "../../" );
const JSON6 = require( "../../" ); // sack.JSON6;

/*
var parser = JSON6.begin( function (data) {
	console.log( "Test 123456 = ", data );
} );
*/
// parser.write( "\'\\x31\\062\\u{33}\\u003456\'" )
// var string = "\'\\x31\\062\\u{33}\\u003456\'";
// for( var n = 0; n < string.length; n++ )
//  parser.write( string[n] );

describe('String tests', function () {
	this.timeout(7000);
	it('Simple string', function () {
		console.log( "Output1:", JSON6.parse( '"Simple String value"' ) );
		let start = Date.now();
		let result;
		for( let n = 0; n < 1000000; n++ ) {
			result = JSON6.parse( '"Simple String value"' );
		}
		let end = Date.now();
		console.log( "1m in ", end - start );
		expect(result).to.equal('Simple String value');


		start = Date.now();
		for( let n = 0; n < 1000000; n++ ) {
			result = JSON.parse( '"Simple String value"' );
		}
		end = Date.now();
		console.log( "1m in ", end - start );
		expect(result).to.equal('Simple String value');
	});
	it('String with whitespace escapes', function () {
		console.log( "Output2:", JSON6.parse( '"Si\\t \\r\\n   lue"' ) );
		let start = Date.now();
		for( let n = 0; n < 1000000; n++ ) {
			JSON6.parse( '"Si\\t \\r\\n   lue"' );
		}

		let end = Date.now();
		console.log( "1m in ", end - start );

		start = Date.now();
		for( let n = 0; n < 1000000; n++ ) {
			JSON.parse( '"Si\\t \\r\\n   lue"' );
		}

		end = Date.now();
		console.log( "1m in ", end-start );
	});
});

// console.log( "Waiting forever..." );
// function wait() { setTimeout( wait, 2000 ) }
// wait();
