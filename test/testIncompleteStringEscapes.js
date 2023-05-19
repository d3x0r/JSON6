'use strict';
const { expect } = require( 'chai' );
const JSON6 = require( ".." );

const parse = JSON6.parse;

describe('Incomplete String Escape tests', function () {
	it('Incomplete string escapes', function () {
		expect(function () {
			parse( "'\\x1'" );
		}).to.throw(Error);

		expect(function () {
			parse( "'\\u31'" );
		}).to.throw(Error);

		expect(function () {
			parse( "'\\u{0'" );
		}).to.throw(Error);
	});
});
