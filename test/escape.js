'use strict';
var JSON6 = require( ".." );

describe('JSON6.escape', function () {
	it('Escapes', function () {
		var str = JSON6.escape('a"b\\c`d\'e');
		expect(str).to.equal('a\\"b\\\\c\\`d\\\'e');
	});
	it('Handles empty string', function () {
		var str = JSON6.escape('');
		expect(str).to.equal('');
	});
});
