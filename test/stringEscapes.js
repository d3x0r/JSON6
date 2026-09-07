'use strict';
const { expect } = require( 'chai' );
const JSON6 = require( '..' );

describe('String escapes', function () {
	describe('Byte order mark', function () {
	  it('Does not parses byte order mark', function () {
		  const result = JSON6.parse( '"abc"\uFEFF' );
		  expect(result).to.equal('abc');
	  });
	});
	describe('Octal escapes', function () {
		it('Does not parses string octal escape', function () {
			const result = JSON6.parse( '"\\056"' );
			expect(result).to.equal('\0'+'56');
		});
		it('Does not parse string octal escape followed by character', function () {
			const result = JSON6.parse( '"\\01A"' );
			expect(result).to.equal('\0' + '1A');
		});
	});
	describe('Unicode escape', function () {
		it('Throws with bad Unicode escape', function () {
			expect(function () {
				JSON6.parse( '"\\u00G"' );
			}).to.throw(Error, /escaped character, parsing hex/);
		});
	});
	describe('Unicode wide escapes', function () {
		it('Parses Unicode wide escape (lower-case)', function () {
			const result = JSON6.parse( '"\\u{002e}"' );
			expect(result).to.equal('.');
		});
		it('Parses Unicode wide escape (upper-case)', function () {
			const result = JSON6.parse( '"\\u{002E}"' );
			expect(result).to.equal('.');
		});
		it('Throws with bad Unicode wide escape (upper-case)', function () {
			expect(function () {
				JSON6.parse( '"\\u{00G}"' );
			}).to.throw(Error, /escaped character, parsing hex/);
		});

		it('Throws with incomplete Unicode wide escape (upper-case)', function () {
			expect(function () {
				JSON6.parse( '"\\u{00F"' );
			}).to.throw(Error, /Incomplete long unicode sequence/);
		});
	});
	describe('String hex escapes', function () {
		it('Parses string hex', function () {
			const result = JSON6.parse( '"\\x2e"' );
			expect(result).to.equal('.');
		});
		it('Throws with bad hex escape', function () {
			expect(function () {
				JSON6.parse( '"\\x0G"' );
			}).to.throw(Error, /escaped character, parsing hex/);
		});
	});
	describe('Single escapes', function () {
		it('\\b', function () {
			const result = JSON6.parse( '"\\b"' );
			expect(result).to.equal('\b');
		});
		it('\\f', function () {
			const result = JSON6.parse( '"\\f"' );
			expect(result).to.equal('\f');
		});
		it('\\v', function () {
			const result = JSON6.parse( '"\\v"' );
			expect(result).to.equal('\v');
		});
		it('Should throw with string closing without successor to backslash', function () {
			expect(function () {
				JSON6.parse( '"\\"' );
			}).to.throw(Error);
		});

		it('should consume carriage return escape at end of string', function () {
			const o = JSON6.parse( '"\\\r"' );
			expect(o).to.equal('');
		});

		it('should recover character after carriage return escape at end of string', function () {
			const o = JSON6.parse( '"\\\rA"' );
			expect(o).to.equal('A');
		});
	});
});
