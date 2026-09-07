'use strict';
const { expect } = require( 'chai' );
const JSON6 = require( ".." );

describe('Single JSON6', function () {
	it('Single JSON6', function () {
		const obj = JSON6.parse( "{ asdf : 1234 } " );
		expect(obj).to.deep.equal({
			asdf: 1234
		});
	});
});
