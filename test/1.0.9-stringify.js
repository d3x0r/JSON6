'use strict';
const { expect } = require( 'chai' );
const JSON6 = require( ".." );

describe('JSON6 stringify', function () {

	it('stringifies Infinity', function () {
		expect( JSON6.stringify( { d:Infinity } ) ).to.equal( '{d:Infinity}' );
	} );

	it('stringifies NaN', function () {
		expect( JSON6.stringify( { e:NaN } ) ).to.equal( '{e:NaN}' );
	} );

	it('basically stringifies', function () {
		expect( JSON6.stringify( { a:1
			, b:"123"
			, c:null
			, d:Infinity, e:NaN
			, f:false
			, t:true } ) )
			.to.equal( '{a:1,b:"123",c:null,d:Infinity,e:NaN,f:false,t:true}' );
	} );

	it('canonically stringifies', function () {
		expect( JSON6.stringify( { z:1
			, y:"123"
			, x:null
			, w:Infinity
			, v:NaN
			, f:false
			, '':''
			, get g() { return 0; }
			, t:true } ) )
			.to.equal( '{"":"",f:false,g:0,t:true,v:NaN,w:Infinity,x:null,y:"123",z:1}' );
	} );

	it('quotes identifier-shaped string values (not just non-identifier ones)', function () {
		// A bareword value (unlike a bareword *key*) would parse back as an
		// identifier/variable reference rather than as the string itself, so
		// it must always be quoted.
		expect( JSON6.stringify( { a:'hello', b:'foo123' } ) )
			.to.equal( '{a:"hello",b:"foo123"}' );
	} );

	it('round-trips an identifier-shaped string value through parse', function () {
		const obj = { a:'hello', b:'true', c:'null' };
		expect( JSON6.parse( JSON6.stringify( obj ) ) ).to.deep.equal( obj );
	} );

	it('can skip non-enumerable', function () {
		const stringifier = JSON6.stringifier();
		stringifier.ignoreNonEnumerable = true;
		const obj = { z:1
			, y:"123"
			, x:null
			, w:Infinity
			, v:NaN
			, f:false
			, t:true };
		Object.defineProperty( obj, "g", { writable:true, value:true } );
		expect( stringifier.stringify( obj ) )
			.to.equal( '{f:false,t:true,v:NaN,w:Infinity,x:null,y:"123",z:1}' );
	} );

	it('skips inherited enumerable properties when ignoring non-enumerable', function () {
		function Base() {}
		Base.prototype.inherited = 'nope';
		const obj = Object.create( Base.prototype );
		obj.own = 1;
		const stringifier = JSON6.stringifier();
		stringifier.ignoreNonEnumerable = true;
		expect( stringifier.stringify( obj ) ).to.equal( '{own:1}' );
	} );

	it('exposes setQuote and the ignoreNonEnumerable getter', function () {
		const stringifier = JSON6.stringifier();
		expect( stringifier.ignoreNonEnumerable ).to.equal( false );
		stringifier.setQuote( "'" );
		expect( stringifier.stringify( { a:'x y' } ) ).to.equal( "{a:'x y'}" );
	} );

	it('sorts keys by default', function () {
		const stringifier = JSON6.stringifier();
		expect( stringifier.sortKeys ).to.equal( true );
	} );

	it('can disable key sorting via the stringifier', function () {
		const stringifier = JSON6.stringifier();
		stringifier.sortKeys = false;
		expect( stringifier.stringify( { z:1, a:2, m:3 } ) ).to.equal( '{z:1,a:2,m:3}' );
	} );

	it('can disable key sorting via JSON6.stringify options', function () {
		expect( JSON6.stringify( { z:1, a:2, m:3 }, undefined, undefined, { sortKeys:false } ) )
			.to.equal( '{z:1,a:2,m:3}' );
	} );

	it('still sorts keys when sortKeys option is not passed', function () {
		expect( JSON6.stringify( { z:1, a:2, m:3 } ) ).to.equal( '{a:2,m:3,z:1}' );
	} );

	it('indents using a numeric space argument', function () {
		expect( JSON6.stringify( { a:1 }, null, 2 ) ).to.equal( '{\n  a: 1\n}' );
	} );

	it('indents using a string space argument', function () {
		expect( JSON6.stringify( { a:1 }, null, '\t' ) ).to.equal( '{\n\ta: 1\n}' );
	} );

	it('throws on an unsupported replacer type', function () {
		expect( () => {
			// @ts-expect-error -- intentionally invalid replacer type to exercise the runtime guard
			JSON6.stringify( { a:1 }, 42 );
		} ).to.throw( 'JSON6.stringify unknown replacer type.' );
	} );

	it('filters fields using a replacer array', function () {
		expect( JSON6.stringify( { a:1, b:2, c:3 }, [ 'a', 'c' ] ) )
			.to.equal( '{a:1,c:3}' );
	} );

	it('transforms values using a replacer function', function () {
		expect( JSON6.stringify( { a:1, b:2 }, ( k, v ) => typeof v === "number" ? v * 2 : v ) )
			.to.equal( '{a:2,b:4}' );
	} );

	it('handles object values when a global toJSOX is present', function () {
		globalThis.toJSOX = function () {};
		try {
			expect( JSON6.stringify( { a:{ b:1 } } ) ).to.equal( '{a:{b:1}}' );
		} finally {
			globalThis.toJSOX = undefined;
		}
	} );

	it('stringifies undefined and null directly', function () {
		const stringifier = JSON6.stringifier();
		expect( stringifier.stringify( undefined ) ).to.equal( 'undefined' );
		expect( stringifier.stringify( null ) ).to.equal( 'null' );
	} );

	it('accepts an explicit asField argument', function () {
		const stringifier = JSON6.stringifier();
		expect( stringifier.stringify( { a:1 }, null, null, 'field' ) ).to.equal( '{a:1}' );
	} );

	it('stringifies an empty object', function () {
		expect( JSON6.stringify( {} ) ).to.equal( '{}' );
	} );

	it('skips non-string entries and missing keys in a replacer array', function () {
		expect( JSON6.stringify( { a:1, b:2 }, [ 'a', 42, 'missing', 'b' ], 2 ) )
			.to.equal( '{\n  a: 1,\n  b: 2\n}' );
	} );

	it('skips inherited enumerable properties by default', function () {
		function Base() {}
		Base.prototype.inherited = 'nope';
		const obj = Object.create( Base.prototype );
		obj.own = 1;
		expect( JSON6.stringify( obj ) ).to.equal( '{own:1}' );
	} );

	it('skips properties with undefined values', function () {
		expect( JSON6.stringify( { a:1, b:undefined } ) ).to.equal( '{a:1}' );
	} );

	it('skips properties removed by an earlier getter during serialization', function () {
		const obj = /** @type {{ a?: number, b?: number }} */ ( {} );
		Object.defineProperty( obj, 'a', { enumerable:true, get() { delete obj.b; return 1; } } );
		obj.b = 2;
		expect( JSON6.stringify( obj ) ).to.equal( '{a:1}' );
	} );

} );
