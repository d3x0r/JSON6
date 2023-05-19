// import * as JSON6 from "../dist/index.mjs";
//require( "../lib/require.js" );

import { expect } from 'chai';
import {default as config} from './1.0.9-require.json6';

describe('Added in 1.0.9 - require(esm)', function () {
	it('extends import operator', function() {
		expect( config ).to.deep.equal( {
			desc: "configuration file to read",
			value:123}
		);
	} );

	it('allows using require on extension', function () {
		return import( "./1.0.9-require.json6" ).then( newConfig=>{
			//console.log( "GOT:", newConfig );
			expect( newConfig.default ).to.deep.equal( {
				desc: "configuration file to read",
				value:123
			} );
		} );
	} );
} );
