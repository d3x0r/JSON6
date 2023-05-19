'use strict';
const { expect } = require( 'chai' );
require( ".." );
//require( "../lib/require.js" );

describe('Added in 1.0.9 - require(cjs)', function () {

	it('allows using require on extension', function () {
		const config = require( "./1.0.9-require.json6" );
		expect( config ).to.deep.equal( {
			   desc: "configuration file to read",
		   value:123}
		 );
	} );
} );
