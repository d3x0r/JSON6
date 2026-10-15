'use strict';
const { expect } = require( 'chai' );
const JSON6 = require( '..' );

describe( 'Root reviver result', function () {
	it( 'returns a replacement object after visiting its children', function () {
		const seen = [];
		const result = JSON6.parse( '{a:2,b:3}', function ( key, value ) {
			seen.push( key );
			if( key === '' ) return { result:value };
			return key === 'b' ? undefined : value * 10;
		} );
		expect( result ).to.deep.equal( { result:{ a:20 } } );
		expect( seen ).to.deep.equal( [ 'a', 'b', '' ] );
	} );

	it( 'returns root primitive replacements and removal', function () {
		expect( JSON6.parse( '2', ( key, value ) => value * 10 ) ).to.equal( 20 );
		expect( JSON6.parse( 'null', () => undefined ) ).to.equal( undefined );
		expect( JSON6.parse( 'true', () => false ) ).to.equal( false );
	} );

	it( 'delivers the root reviver result for each streamed value', function () {
		const values = [];
		const parser = JSON6.begin( value => values.push( value ), function ( key, value ) {
			if( key === '' ) return value === null ? undefined : { result:value };
			return typeof value === 'number' ? value * 10 : value;
		} );
		parser.write( '{a:2} 3 null ' );
		expect( values ).to.deep.equal( [ { result:{ a:20 } }, { result:3 }, undefined ] );
	} );
} );
