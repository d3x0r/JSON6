'use strict';
import * as JSON6 from "../dist/index.mjs";
//require( "../lib/require.js" );

describe('Added in 1.0.9 - require(esm)', function () {
	
	it('allows using require on extension', function () {
		const config = import( "./1.0.9-require.json6" ).then( config=>{
			expect( config ).to.deep.equal( {
				   desc: "configuration file to read",
			   value:123}
			 );
		} );
	} );
} );