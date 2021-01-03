'use strict';
import * as JSON6 from "../dist/index.mjs";
//require( "../lib/require.js" );

//import {default as config} from './1.0.9-require.json6'
//console.log( config );

describe('Added in 1.0.9 - require(esm)', function () {
	
	it('allows using require on extension', function () {
		console.log( "IMPORT:" );
		return import( "./1.0.9-require.json6" ).then( config=>{
			//console.log( "GOT:", config );
			expect( config.default ).to.deep.equal( {
				   desc: "configuration file to read",
			   value:123}
			 );
		} );
	} );
} );
