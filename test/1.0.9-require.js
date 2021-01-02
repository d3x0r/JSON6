'use strict';
require( ".." );
//require( "../lib/require.js" );

describe('Added in 1.0.9 - require', function () {
	
	it('allows using require on extension', function () {
		const config = require( "./config.json6" );
		expect( config ).to.deep.equal( {
			   desc: "configuratino file to read",
		   value:123}
		 );
	} );
} );
