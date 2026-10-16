'use strict';
const { expect } = require( 'chai' );
const JSON6 = require( '..' );

describe( 'Stringify replacer values', function () {
	it( 'passes original strings to the replacer before escaping them', function () {
		/** @type {unknown[]} */
		const seen = [];
		const object = { name:'old', items:[ 'a"b', 'back\\slash' ] };
		const text = JSON6.stringify( object, function ( key, value ) {
			if( typeof value === 'string' ) seen.push( value );
			return value;
		} );
		expect( seen ).to.deep.equal( [ 'a"b', 'back\\slash', 'old' ] );
		expect( JSON6.parse( text ) ).to.deep.equal( object );
	} );

	it( 'quotes strings returned by the replacer at every level', function () {
		const text = JSON6.stringify( { name:1, items:[ 2 ] }, ( key, value ) => typeof value === 'number' ? 'ready' : value );
		expect( JSON6.parse( text ) ).to.deep.equal( { name:'ready', items:[ 'ready' ] } );
		expect( JSON6.stringify( 1, () => 'root' ) ).to.equal( '"root"' );
	} );

	it( 'runs the root replacer for null and undefined', function () {
		expect( JSON6.stringify( null, () => 'ready' ) ).to.equal( '"ready"' );
		expect( JSON6.stringify( undefined, () => 42 ) ).to.equal( '42' );
		expect( JSON6.stringify( null, () => undefined ) ).to.equal( undefined );
		expect( JSON6.stringify( null ) ).to.equal( 'null' );
		expect( JSON6.stringify( undefined ) ).to.equal( 'undefined' );
	} );

	it( 'uses the reusable stringifier quote for replacement strings', function () {
		const stringifier = JSON6.stringifier();
		stringifier.setQuote( "'" );
		expect( stringifier.stringify( 1, () => "can't" ) ).to.equal( "'can\\'t'" );
	} );
} );
