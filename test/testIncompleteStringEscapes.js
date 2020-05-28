'use strict';

const JSON6 = require( ".." );

const parse = JSON6.parse;

describe('Incomplete String Escape tests', function () {

	expect(function () {
		parse( "'\\x1'" );
	}).to.throw(Error);

	it('Parses string octal escape followed by character', function () {
		const result = JSON6.parse( '"\\012"' );
		expect(result).to.equal('\0' + '12');
	});

	expect(function () {
		parse( "'\\u31'" );
	}).to.throw(Error);

	expect(function () {
		parse( "'\\u{0'" );
	}).to.throw(Error);

} );
