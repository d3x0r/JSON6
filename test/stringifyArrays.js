'use strict';
const { expect } = require( 'chai' );
const JSON6 = require( ".." );

// Arrays used to be emitted through the object path as {"0":..,"1":..}.
describe('JSON6 stringify arrays', function () {

	it( 'emits arrays with brackets', function () {
		expect( JSON6.stringify( [ 1, 2, 3 ] ) ).to.equal( '[1,2,3]' );
		expect( JSON6.stringify( [] ) ).to.equal( '[]' );
		expect( JSON6.stringify( [ 'a', 'b c', 'true' ] ) ).to.equal( '["a","b c","true"]' );
		expect( JSON6.stringify( [ true, false, null, NaN, Infinity, -Infinity ] ) ).to.equal( '[true,false,null,NaN,Infinity,-Infinity]' );
	} );

	it( 'nests arrays and objects either way', function () {
		expect( JSON6.stringify( { a: [ 1, { b: [ 2 ] } ] } ) ).to.equal( '{a:[1,{b:[2]}]}' );
		expect( JSON6.stringify( [ [ 1 ], [ [ 2 ] ], {} ] ) ).to.equal( '[[1],[[2]],{}]' );
	} );

	it( 'keeps holes and undefined distinct', function () {
		const holes = [ 1, , 3 ]; // eslint-disable-line no-sparse-arrays
		expect( JSON6.stringify( holes ) ).to.equal( '[1,,3]' );
		expect( JSON6.stringify( [ 1, undefined, 3 ] ) ).to.equal( '[1,undefined,3]' );
		const trailing = [ 1, , ]; // eslint-disable-line no-sparse-arrays
		expect( trailing.length ).to.equal( 2 );
		expect( JSON6.stringify( trailing ) ).to.equal( '[1,,]' );
	} );

	it( 'round-trips through parse', function () {
		for( const arr of [ [], [ 1, 2, 3 ], [ 'x', [ 'y', { z: [] } ] ], [ 1, undefined, 'a b' ] ] ) {
			expect( JSON6.parse( JSON6.stringify( arr ) ) ).to.deep.equal( arr );
		}
		const holes = [ 1, , 3 ]; // eslint-disable-line no-sparse-arrays
		const back = /** @type {unknown[]} */ ( JSON6.parse( JSON6.stringify( holes ) ) );
		expect( back.length ).to.equal( 3 );
		expect( 1 in back ).to.equal( false );
		const trailing = [ 1, , ]; // eslint-disable-line no-sparse-arrays
		const back2 = /** @type {unknown[]} */ ( JSON6.parse( JSON6.stringify( trailing ) ) );
		expect( back2.length ).to.equal( 2 );
		expect( 1 in back2 ).to.equal( false );
	} );

	it( 'indents when a space argument is given', function () {
		expect( JSON6.stringify( [ 1, [ 2 ] ], null, 2 ) ).to.equal( '[\n  1,\n  [\n    2\n  ]\n]' );
		expect( JSON6.stringify( { a: [ 1 ] }, null, '\t' ) ).to.equal( '{\n\ta: [\n\t\t1\n\t]\n}' );
		const trailing = [ 1, , ]; // eslint-disable-line no-sparse-arrays
		expect( JSON6.stringify( trailing, null, 1 ) ).to.equal( '[\n 1,\n ,\n]' );
	} );

	it( 'passes array elements through a replacer function with their index as key', function () {
		/** @type {string[]} */
		const seen = [];
		const out = JSON6.stringify( [ 1, 2 ], function ( k, v ) { seen.push( k ); return typeof v === 'number' ? v * 10 : v; } );
		expect( out ).to.equal( '[10,20]' );
		expect( seen ).to.deep.equal( [ '', '0', '1' ] );
	} );

	it( 'quotes object keys only when needed', function () {
		// keys still use the identifier rule: keywords, digit-first, and punctuation get quoted
		expect( JSON6.stringify( { true: 1, '1x': 2, 'a b': 3, '': 4, plain: 5, $ok: 6 } ) )
			.to.equal( '{"":4,$ok:6,"1x":2,"a b":3,plain:5,"true":1}' );
	} );
} );
