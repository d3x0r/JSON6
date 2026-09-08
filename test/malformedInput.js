'use strict';
const { expect } = require( 'chai' );
const JSON6 = require( ".." );

const parse = JSON6.parse;

// Inputs that used to be silently accepted with a wrong or missing value.
describe('Malformed input is rejected', function () {

	describe('two values with no separator', function () {
		for( const src of [ '[1 2]', '[1 true]', '[1 false]', '[1 null]', '[1 undefined]', '[1 Infinity]', '[1 NaN]',
			'[true 1]', '["a" 1]', '[1 {}]', '[{} {}]', '[1 -2]', '[1 +2]', '{a:1 2}', '{a:1 {}}' ] ) {
			it( `rejects ${JSON.stringify( src )}`, function () {
				expect( () => parse( src ) ).to.throw( Error, /Two values with no separator/ );
			} );
		}
		it( 'still accepts separated values', function () {
			expect( parse( '[1, 2, true, {}, -2]' ) ).to.deep.equal( [ 1, 2, true, {}, -2 ] );
			expect( parse( '{a:1, b:{}}' ) ).to.deep.equal( { a: 1, b: {} } );
		} );
	} );

	describe('object field name with no value', function () {
		for( const src of [ '{a}', '{a }', '{"a"}', "{'a'}", '{a:1,b}', '{a:1,"b"}' ] ) {
			it( `rejects ${JSON.stringify( src )}`, function () {
				expect( () => parse( src ) ).to.throw( Error, /field name with no value/ );
			} );
		}
		it( 'still accepts empty objects and trailing commas', function () {
			expect( parse( '{}' ) ).to.deep.equal( {} );
			expect( parse( '{ }' ) ).to.deep.equal( {} );
			expect( parse( '{a:1,}' ) ).to.deep.equal( { a: 1 } );
			expect( parse( '{"a":1,}' ) ).to.deep.equal( { a: 1 } );
			expect( parse( '{a:{},b:[],}' ) ).to.deep.equal( { a: {}, b: [] } );
		} );
	} );

	describe('incomplete keyword', function () {
		for( const src of [ 'tru', 'fals', 'nul', 'undef', 'Infinit', 'Na', '[tru]', '[tru,1]', '[1,tru]', '{a:tru}', '{a:tru,b:1}' ] ) {
			it( `rejects ${JSON.stringify( src )}`, function () {
				expect( () => parse( src ) ).to.throw( Error, /Incomplete keyword/ );
			} );
		}
		it( 'still accepts complete keywords, and a truncated keyword as an object key', function () {
			expect( parse( 'true' ) ).to.equal( true );
			expect( parse( '[true,null]' ) ).to.deep.equal( [ true, null ] );
			expect( parse( '{a:undefined}' ) ).to.deep.equal( { a: undefined } );
			expect( parse( '{tru:1}' ) ).to.deep.equal( { tru: 1 } );
		} );
	} );

	describe('sign with no number', function () {
		for( const src of [ '-', '+', '[-]', '[-,1]', '{a:-}', '--' ] ) {
			it( `rejects ${JSON.stringify( src )}`, function () {
				expect( () => parse( src ) ).to.throw( Error, /Sign with no number/ );
			} );
		}
		it( 'still accepts signed numbers and keywords', function () {
			expect( parse( '-1' ) ).to.equal( -1 );
			expect( parse( '+1' ) ).to.equal( 1 );
			expect( parse( '--1' ) ).to.equal( 1 );
			expect( parse( '-Infinity' ) ).to.equal( -Infinity );
			expect( parse( '[-1,-2]' ) ).to.deep.equal( [ -1, -2 ] );
			expect( parse( '{a:-1}' ) ).to.deep.equal( { a: -1 } );
		} );
	} );

	describe('malformed number', function () {
		for( const src of [ '1e', '0e', '.5.', '.e3', '1e+', '.', '0x', '0b', '[1e,2]', '{a:1e}', '{a:.5.}' ] ) {
			it( `rejects ${JSON.stringify( src )}`, function () {
				expect( () => parse( src ) ).to.throw( Error, /Invalid number/ );
			} );
		}
		it( 'rejects a malformed number left pending at end of stream', function () {
			const parser = JSON6.begin( () => {} );
			parser.write( '1e' );
			expect( () => parser.write() ).to.throw( Error, /Invalid number/ );
		} );
		it( 'still accepts every well-formed number shape', function () {
			expect( parse( '1e3' ) ).to.equal( 1000 );
			expect( parse( '.5' ) ).to.equal( 0.5 );
			expect( parse( '5.' ) ).to.equal( 5 );
			expect( parse( '1.e3' ) ).to.equal( 1000 );
			expect( parse( '0x1F' ) ).to.equal( 31 );
			expect( parse( '0o17' ) ).to.equal( 15 );
			expect( parse( '0b101' ) ).to.equal( 5 );
			expect( parse( '1_000' ) ).to.equal( 1000 );
			expect( parse( '0123' ) ).to.equal( 123 );
			expect( parse( '1.5e-3' ) ).to.equal( 0.0015 );
		} );
		it( 'still completes a number split across writes', function () {
			/** @type {unknown[]} */
			const results = [];
			const parser = JSON6.begin( v => results.push( v ) );
			parser.write( '1e' );
			parser.write( '5 ' );
			expect( results ).to.deep.equal( [ 1e5 ] );
		} );
	} );

	describe('document with no value', function () {
		for( const src of [ '', ' ', '\n', '/* c */', '//', '// c\n' ] ) {
			it( `rejects ${JSON.stringify( src )}`, function () {
				expect( () => parse( src ) ).to.throw( Error, /No value found/ );
			} );
		}
		it( 'still returns undefined for the undefined keyword', function () {
			expect( parse( 'undefined' ) ).to.equal( undefined );
			expect( parse( ' undefined // c' ) ).to.equal( undefined );
		} );
		it( 'still reports an unclosed block comment', function () {
			expect( () => parse( '/* c' ) ).to.throw( Error, /missing close/ );
		} );
		it( 'supports a reviver that calls parse re-entrantly', function () {
			// exercises the second parser in the pool
			const o = parse( '{a:"[1,2]",b:"{c:3}"}', ( k, v ) => typeof v === 'string' ? parse( v ) : v );
			expect( o ).to.deep.equal( { a: [ 1, 2 ], b: { c: 3 } } );
		} );
		it( 'restores the parser pool level after a throw', function () {
			// a throw inside parse must not leak the nested-parse counter
			for( let i = 0; i < 5; i++ ) {
				expect( () => parse( '' ) ).to.throw( Error );
			}
			expect( parse( '1' ) ).to.equal( 1 );
		} );
	} );

	describe('streaming keeps working across writes', function () {
		it( 'completes a keyword split across writes', function () {
			/** @type {unknown[]} */
			const results = [];
			const parser = JSON6.begin( v => results.push( v ) );
			parser.write( 'tr' );
			parser.write( 'ue ' );
			expect( results ).to.deep.equal( [ true ] );
		} );
		it( 'requires a callback before write() can deliver values', function () {
			// parse() drives the parser through _write()/value() and needs none.
			const parser = JSON6.begin();
			expect( () => parser.write( '1 ' ) ).to.throw( Error, /Callback function must be passed to begin/ );
			expect( parser._write( '1', true ) ).to.be.above( 0 );
			expect( parser.value() ).to.equal( 1 );
		} );
		it( 'rejects two values with no separator inside a streamed array', function () {
			const parser = JSON6.begin( () => {} );
			expect( () => parser.write( '[1 2]' ) ).to.throw( Error, /Two values with no separator/ );
		} );
	} );
} );
