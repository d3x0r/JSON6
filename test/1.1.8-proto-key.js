'use strict';
const { expect } = require( 'chai' );
const JSON6 = require( ".." );

/**
 * parse(), with the result typed as a plain record so the tests can read the field
 * by name.  Bracket access throughout, to say that '__proto__' is wanted as an own
 * key and not as the prototype accessor.
 * @param {string} text
 * @param {(this:unknown, key:string, value:unknown)=>unknown} [reviver]
 * @returns {Record<string, any>}
 */
function parse( text, reviver ) {
	return /** @type {Record<string, any>} */ ( JSON6.parse( text, reviver ) );
}

describe('Added in 1.1.8 - a literal __proto__ key is data, not a prototype', function () {

	// `obj[name] = value` reaches the accessor inherited from Object.prototype for the
	// one name that has one, so the field set the parsed object's prototype instead of
	// becoming a field: Object.keys(), JSON6.stringify() and any schema check saw
	// nothing, while a plain read of the field still returned the document's value.
	// A primitive there was dropped outright.

	it( 'does not let an object value become the prototype', function () {
		const o = parse( '{"__proto__":{"x":1}}' );
		expect( Object.getPrototypeOf( o ) ).to.equal( Object.prototype );
		expect( Object.keys( o ) ).to.deep.equal( [ '__proto__' ] );
		expect( o['__proto__'] ).to.deep.equal( { x:1 } );
	} );

	it( 'keeps the field visible to every reader', function () {
		const o = parse( '{"__proto__":{"isAdmin":true},"user":"bob"}' );
		expect( Object.keys( o ) ).to.deep.equal( [ '__proto__', 'user' ] );
		// the whole point: a validator walking the keys saw only 'user', while
		// o.isAdmin read true straight off the attacker's object
		expect( o['isAdmin'] ).to.equal( undefined );
		expect( Object.prototype.hasOwnProperty.call( o, '__proto__' ) ).to.equal( true );
	} );

	it( 'does not drop a primitive there', function () {
		expect( parse( '{"__proto__":5}' )['__proto__'] ).to.equal( 5 );
		expect( parse( '{"__proto__":"s"}' )['__proto__'] ).to.equal( "s" );
		expect( parse( '{"__proto__":null}' )['__proto__'] ).to.equal( null );
		expect( parse( '{"__proto__":true}' )['__proto__'] ).to.equal( true );
		expect( parse( '{"__proto__":NaN}' )['__proto__'] ).to.be.NaN;
	} );

	it( 'handles it unquoted, nested and as an array', function () {
		const n = parse( '{a:{__proto__:{y:2}}}' );
		expect( Object.getPrototypeOf( n['a'] ) ).to.equal( Object.prototype );
		expect( n['a']['__proto__'] ).to.deep.equal( { y:2 } );
		// an array field value is stored when it opens, not at objectPush()
		expect( parse( '{"__proto__":[1,2]}' )['__proto__'] ).to.deep.equal( [ 1, 2 ] );
		expect( parse( '{__proto__:[{b:1}]}' )['__proto__'][0] ).to.deep.equal( { b:1 } );
	} );

	it( 'round-trips, and agrees with JSON.parse', function () {
		const doc = '{"__proto__":{"x":1},"b":2}';
		const o = parse( doc );
		// this used to stringify as '{b:2}' -- the data was simply gone
		const text = /** @type {string} */ ( JSON6.stringify( o ) );
		expect( text ).to.contain( '__proto__' );
		expect( parse( text )['__proto__'] ).to.deep.equal( { x:1 } );
		expect( JSON.stringify( o ) ).to.equal( JSON.stringify( JSON.parse( doc ) ) );
	} );

	it( 'lets a reviver see and replace the field', function () {
		/** @type {string[]} */
		const seen = [];
		const o = parse( '{"__proto__":{"x":1}}', function( k, v ) {
			seen.push( k );
			return k === 'x' ? 2 : v;
		} );
		expect( seen ).to.contain( '__proto__' );
		expect( o['__proto__'] ).to.deep.equal( { x:2 } );
		expect( Object.getPrototypeOf( o ) ).to.equal( Object.prototype );
	} );

	it( 'leaves other inherited names, and Object.prototype, alone', function () {
		// only '__proto__' has an accessor on Object.prototype; the rest are plain data
		// properties that assignment already shadows, which is why there is no list of
		// names here and every other field keeps the fast path
		const o = parse( '{"constructor":1,"toString":2,"valueOf":3,"hasOwnProperty":4}' );
		expect( Object.keys( o ) ).to.deep.equal( [ 'constructor', 'toString', 'valueOf', 'hasOwnProperty' ] );
		parse( '{"__proto__":{"polluted":"yes"}}' );
		expect( /** @type {Record<string, unknown>} */ ( {} )['polluted'] ).to.equal( undefined );
		expect( /** @type {Record<string, unknown>} */ ( Object.prototype )['polluted'] ).to.equal( undefined );
	} );
} );
