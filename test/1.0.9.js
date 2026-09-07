'use strict';
const { expect } = require( 'chai' );
const JSON6 = require( ".." );

describe('JSON6.forgiving leading `+` ', function () {
	it('accepts `+ 8`', function () {
		expect( JSON6.parse( '+ 8' ) ).to.equal( 8 );
	} );
	it('accepts `+ Infinity`', function () {
		expect( JSON6.parse( '+ Infinity' ) ).to.equal( Infinity );
	} );
	it('throws `123+44`', function () {
		expect( function() { JSON6.parse( '123+44' ); } ).to.throw( Error );
	} );
} );
