'use strict';
const { expect } = require( 'chai' );
require( ".." );
//require( "../lib/require.js" );

describe('Added in 1.1.2(JSON6) - bad require(cjs)', function () {

	it('allows using require on extension', function () {
		expect( ()=>{
			const config = require( "./1.1.2-bad-require.json6" );
			expect( config ).to.deep.equal( {
				   desc: "configuration file to read",
			   value:123}
			 );
		} ).to.throw();
	} );
} );
