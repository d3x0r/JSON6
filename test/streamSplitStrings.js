'use strict';
const { expect } = require( 'chai' );
const JSON6 = require( '..' );

describe( 'Streaming split root strings', function () {
	it( 'delivers a split root string before the next value in the same chunk', function () {
		/** @type {unknown[]} */
		const values = [];
		const parser = JSON6.begin( value => values.push( value ) );
		parser.write( '"hel' );
		parser.write( 'lo" 123 ' );
		expect( values ).to.deep.equal( [ 'hello', 123 ] );
	} );

	it( 'delivers subsequent string and keyword values', function () {
		/** @type {unknown[]} */
		const values = [];
		const parser = JSON6.begin( value => values.push( value ) );
		parser.write( "'hel" );
		parser.write( "lo' 'world' true " );
		expect( values ).to.deep.equal( [ 'hello', 'world', true ] );
	} );

	it( 'continues handling split strings inside arrays and object keys', function () {
		/** @type {unknown[]} */
		const values = [];
		const parser = JSON6.begin( value => values.push( value ) );
		parser.write( '["hel' );
		parser.write( 'lo",2] {"na' );
		parser.write( 'me":"hel' );
		parser.write( 'lo"}' );
		expect( values ).to.deep.equal( [ [ 'hello', 2 ], { name:'hello' } ] );
	} );
} );
