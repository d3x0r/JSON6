'use strict';
const { expect } = require( 'chai' );
const JSON6 = require( '..' );

describe( 'Supported comment lexing', function () {
	it( 'accepts comments immediately following numeric values', function () {
		expect( JSON6.parse( '{count:1/* units */,next:2}' ) ).to.deep.equal( { count:1, next:2 } );
		expect( JSON6.parse( '[0xff// hex\n,2]' ) ).to.deep.equal( [ 255, 2 ] );
	} );

	it( 'closes a block comment after consecutive asterisks', function () {
		expect( JSON6.parse( '/***/ {a:1}' ) ).to.deep.equal( { a:1 } );
		expect( JSON6.parse( '{a:/** comment ***/1}' ) ).to.deep.equal( { a:1 } );
	} );

	it( 'streams repeated asterisks and the closing slash in separate chunks', function () {
		/** @type {unknown[]} */
		const values = [];
		const parser = JSON6.begin( value => values.push( value ) );
		parser.write( '/**' );
		parser.write( '*' );
		parser.write( '/ {a:1/* units **' );
		parser.write( '*/}' );
		expect( values ).to.deep.equal( [ { a:1 } ] );
	} );
} );
