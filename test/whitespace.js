'use strict';
const { expect } = require( 'chai' );
const JSON6 = require( ".." );

const parse = JSON6.parse;

// ECMAScript WhiteSpace and LineTerminator characters that JSON6 accepts between tokens.
const WS = {
	'space': ' ', 'tab': '\t', 'LF': '\n', 'CR': '\r',
	'VT': '', 'FF': '', 'NBSP': ' ', 'ZWNBSP': '﻿',
	'LS': ' ', 'PS': ' ',
};

describe('Whitespace', function () {
	for( const [ name, ch ] of Object.entries( WS ) ) {
		describe( name, function () {
			it( 'terminates a number', function () {
				expect( parse( '1' + ch ) ).to.equal( 1 );
				expect( parse( '[1' + ch + ',2]' ) ).to.deep.equal( [ 1, 2 ] );
			} );
			it( 'terminates a keyword', function () {
				expect( parse( 'true' + ch ) ).to.equal( true );
				expect( parse( '[null' + ch + ']' ) ).to.deep.equal( [ null ] );
			} );
			it( 'is skipped around structure and field names', function () {
				expect( parse( ch + '[' + ch + '1' + ch + ']' + ch ) ).to.deep.equal( [ 1 ] );
				expect( parse( '{' + ch + 'a' + ch + ':' + ch + 'true' + ch + '}' ) ).to.deep.equal( { a: true } );
			} );
			it( 'is kept literally inside a string', function () {
				expect( parse( '"a' + ch + 'b"' ) ).to.equal( 'a' + ch + 'b' );
			} );
		} );
	}

	describe( 'line terminators end a // comment', function () {
		for( const [ name, ch ] of [ [ 'LF', '\n' ], [ 'CR', '\r' ], [ 'LS', ' ' ], [ 'PS', ' ' ] ] ) {
			it( name, function () {
				expect( parse( '//c' + ch + '1' ) ).to.equal( 1 );
				expect( parse( '[1,//c' + ch + '2]' ) ).to.deep.equal( [ 1, 2 ] );
			} );
		}
		it( 'other whitespace does not', function () {
			expect( () => parse( '//c1' ) ).to.throw( Error, /No value found/ );
		} );
	} );
} );
