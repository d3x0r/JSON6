'use strict';
const { expect } = require( 'chai' );
const JSON6 = require( '..' );

describe( 'Stringify delimited object keys', function () {
	it( 'round-trips keys containing brackets and quote delimiters', function () {
		const object = { 'a[b':1, 'a]b':2, 'a"b':3, "a'b":4, 'a`b':5 };
		expect( JSON6.parse( JSON6.stringify( object ) ) ).to.deep.equal( object );
	} );

	it( 'round-trips keys containing supported whitespace', function () {
		const object = { 'a\vb':1, 'a\fb':2, 'a\u00a0b':3, 'a\u2028b':4, 'a\u2029b':5, 'a\ufeffb':6 };
		expect( JSON6.parse( JSON6.stringify( object ) ) ).to.deep.equal( object );
	} );

	it( 'quotes and escapes keys with a reusable custom quote', function () {
		const stringifier = JSON6.stringifier();
		stringifier.setQuote( "'" );
		const object = { "a'b":1, 'a[b]':2 };
		expect( JSON6.parse( stringifier.stringify( object ) ) ).to.deep.equal( object );
	} );
} );
