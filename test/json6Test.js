'use strict';
const JSON6 = require( ".." );
const parse = JSON6.parse;

//console.log( "Stringify Test:", vfs.JSON.stringify( { a:123 } ) );

//var x = '[' + JSON.stringify( new Date() ) + ']';
//console.log( "Date Output is:", x, JSON.stringify( new Date() ) );

describe('Basic parsing', function () {
	describe('Whitespace', function () {
		it('accepts space before colon', function () {
			const o = parse( "{test  : 0 }" );
			//console.log( "123 is", o, typeof o );
			expect(o).to.deep.equal( {test:0} );
		});
		it('accepts space before colon', function () {
			const o = parse( "{  test  : 0 }" );
			//console.log( "obj is", o, typeof o );
			expect(o).to.deep.equal( {test:0} );
		});
	});
	describe('Numbers', function () {
		it('Simple decimal', function () {
			const o = parse( "123" );
			//console.log( "123 is", o, typeof o );
			expect(o).to.equal(123);
		});
		it('Decimal with bad character', function () {
			expect(function () {
				parse( "12\u{10FFFF}" );
			}).to.throw(Error, /fault while parsing number/);
		});
		it('Decimal with separators', function () {
			const o = parse( "123_456_789" );
			//console.log( "123_456_789 is", o, typeof o );
			expect(o).to.equal(123456789);
		});
		it('Leading plain zero octals treated as decimals', function () {
			const o = parse( "0123" );
			const withinArr = parse( "[0123]" );
			const withinObj = parse( "{a: 0123}" );
			const negO = parse( "-0123" );
			const negWithinArr = parse( "[-0123]" );
			const negWithinObj = parse( "{a: -0123}" );
			//console.log( "0123 is", o, typeof o );
			expect(o).to.equal(123);
			expect(withinArr).to.deep.equal([123]);
			expect(withinObj).to.deep.equal({a: 123});
			expect(negO).to.equal(-123);
			expect(negWithinArr).to.deep.equal([-123]);
			expect(negWithinObj).to.deep.equal({a: -123});
		});

		it('Ignores treating plain zero octals as decimals', function () {
			const o = parse( "0123" );
			const withinArr = parse( "[0123]" );
			const withinObj = parse( "{a: 0123}" );
			const negO = parse( "-0123" );
			const negWithinArr = parse( "[-0123]" );
			const negWithinObj = parse( "{a: -0123}" );
			//console.log( "0123 is", o, typeof o );
			expect(o).to.equal(123);
			expect(withinArr).to.deep.equal([123]);
			expect(withinObj).to.deep.equal({a: 123});
			expect(negO).to.equal(-123);
			expect(negWithinArr).to.deep.equal([-123]);
			expect(negWithinObj).to.deep.equal({a: -123});
		});

		it('Leading zero-o octals', function () {
			const o = parse( "0o123" );
			//console.log( "0o123 is", o, typeof o );
			expect(o).to.equal(83);
		});
		it('Hexadecimal', function () {
			const o = parse( "0x123" );
			//console.log( "0x123 is", o, typeof o );
			expect(o).to.equal(291);
		});
		it('Binary', function () {
			const o = parse( "0b1010101" );
			//console.log( "0b1010101 is", o, typeof o );
			expect(o).to.equal(85);
		});
	});
	describe('Special numbers', function () {
		it('NaN', function () {
			const o = parse( "NaN" );
			//console.log( "o is", o, typeof o );
			expect(o).to.be.NaN;
		});
		it('-NaN', function () {
			const o = parse( "-NaN" );
			//console.log( "o is", o, typeof o );
			expect(o).to.be.NaN;
		});
		it('Infinity', function () {
			const o = parse( "Infinity" );
			//console.log( "o is", o, typeof o );
			expect(o).to.equal(Infinity);
		});
		it('-Infinity', function () {
			const o = parse( "-Infinity" );
			//console.log( "o is", o, typeof o );
			expect(o).to.equal(-Infinity);
		});
	});
	describe('Strings', function () {
		it('String as number', function () {
			const o = parse( "\"123\"" );
			expect(o).to.equal('123');
		});
		it('String with non-BMP characters', function () {
			const o = parse( "\"\u{10FFFF}\"" );
			expect(o).to.equal('\u{10FFFF}');
		});
		it('String standard whitespace escape characters', function () {
			const o = parse( "\"\\n\\r\\f\\t\"" );
			expect(o).to.equal('\n\r\f\t');
		});
		it('String standard whitespace escape characters', function () {
			const o = parse( "\"\\xFF\"" );
			expect(o).to.equal('\xFF');
		});

		it('String standard whitespace escape characters', function () {
			const o = parse( "\"\\u01AF\"" );
			expect(o).to.equal('\u01AF');
		});
	});
	describe('Comments', function () {
		it('Should throw with invalid comment', function () {
			expect(function () {
				parse( "/a" );
			}).to.throw(Error);
		});
		it('Should throw with incomplete comment (single slash)', function () {
			expect(function () {
				parse( "/" );
			}).to.throw(Error);
		});
		it('Should throw with incomplete comment (closing asterisk)', function () {
			expect(function () {
				parse( "/* *" );
			}).to.throw(Error);
		});
		it('Should not err (will warn) with comment begun at end', function () {
			const o = parse( "//" );
			//console.log( "o is", o, typeof o );
			expect(o).to.equal(undefined);
		});
		it('Should throw with incomplete comment with 2 asterisks', function () {
			expect(function () {
				parse( "/**a" );
			}).to.throw(Error);
		});
		it('Should throw with incomplete comment with 3 asterisks', function () {
			expect(function () {
				parse( "/***" );
			}).to.throw(Error);
		});
		it('Should handle comment', function () {
			const o = parse( "/**/" );
			//console.log( "o is", o, typeof o );
			expect(o).to.equal(undefined);
		});
	});
	describe('Other', function () {
		it('null', function () {
			const o = parse( "null" );
			//console.log( "o is", o, typeof o );
			expect(o).to.be.null;
		});
		it('null as `null`', function () {
			const o = parse( null );
			//console.log( "o is", o, typeof o );
			expect(o).to.be.null;
		});
		it('true', function () {
			const o = parse( "true" );
			//console.log( "o is", o, typeof o );
			expect(o).to.be.true;
		});
		it('false', function () {
			const o = parse( "false" );
			//console.log( "o is", o, typeof o );
			expect(o).to.be.false;
		});
		it('undefined', function () {
			const o = parse( "undefined" );
			//console.log( "o is", o, typeof o );
			expect(o).to.be.undefined;
		});
	});
	describe('Objects', function () {
		describe('Keys', function () {
			it('Double-quoted key', function () {
				const o = parse( "{\"a\":123}" );
				//console.log( "o is", o );
				expect(o).to.deep.equal({ a: 123 });
			});
			it('empty object', function () {
				const o = parse( "{}" );
				expect(o).to.deep.equal({});
			});
			it('Back-tick quoted key', function () {
				const o = parse( "{`a`:123}" );
				//console.log( "o is", o );
				expect(o).to.deep.equal({ a: 123 });
			});
			it('Carriage return within key', function () {
				const o = parse( "{\ra:123}" );
				//console.log( "o is", o );
				expect(o).to.deep.equal({ a: 123 });
			});
			it('Newline within key', function () {
				const o = parse( "{\na:123}" );
				//console.log( "o is", o );
				expect(o).to.deep.equal({ a: 123 });
			});
			it('Should throw with extra single quotes within key', function () {
				expect(function () {
					parse( "{''':123}" );
				}).to.throw(Error);
			});
		});
		describe('Key values', function () {
			it('Decimal key value', function () {
				const o = parse( "{a:123}" );
				//console.log( "o is", o );
				expect(o).to.deep.equal({ a:123 });
			});
			it('ES6 template key value', function () {
				const o = parse( "{a:`abcdef`}" );
				//console.log( "o is", o );
				expect(o).to.deep.equal({ a: 'abcdef' });
			});

			it('Double-quoted key value', function () {
				const o = parse( "{a:\"abcdef\"}" );
				//console.log( "o is", o );
				expect(o).to.deep.equal({ a: 'abcdef' });
			});

			it('Single-quoted key value (with newline)', function () {
				const o = parse( "{a:'abc\ndef'}" );
				//console.log( "o is", o );
				expect(o).to.deep.equal({ a: 'abc\ndef' });
			});

			it('Single-quoted key value (with trailing backslash and newline)', function () {
				const o = parse( "{a:'abc\\\ndef'}" );
				//console.log( "o is", o );
				expect(o).to.deep.equal({ a: 'abcdef' });
			});

			it('Single-quoted key value with backslash, carriage return, and newline', function () {
				const o = parse( "{a:'abc\\\r\ndef'}" );
				//console.log( "o is", o );
				expect(o).to.deep.equal({ a: 'abcdef' });
			});
			it('Single-quoted key value with backslash and line separator', function () {
				const o = parse( "{a:'abc\\\u2028def'}" );
				//console.log( "o is", o );
				expect(o).to.deep.equal({ a: 'abcdef' });
			});
			it('Single-quoted key value with backslash and paragraph separator', function () {
				const o = parse( "{a:'abc\\\u2029def'}" );
				//console.log( "o is", o );
				expect(o).to.deep.equal({ a: 'abcdef' });
			});
			it('Unquoted keyword (true)', function () {
				const o = parse( "{ true:1 }" );
				//console.log( "o is", o );
				expect(o).to.deep.equal({ true: 1 });
			});
			it('Unquoted keyword (null)', function () {
				const o = parse( "{ null:1 }" );
				//console.log( "o is", o );
				expect(o).to.deep.equal({ null: 1 });
			});
			it('Handles trailing commas', function () {
				const o = parse(`{
					    abc: {
					      'a': 5,
					    }
					}`);
				//console.log( "o is", o );
				expect(o).to.deep.equal({
				    abc: {
				      a: 5,
				    }
				});
			});
		});

		it('Handles trailing commas', function () {
			const o = parse(`{
				    abc: {
				      'a': 5,
				    }
				}`);
			//console.log( "o is", o );
			expect(o).to.deep.equal({
			    abc: {
			      a: 5,
			    }
			});
		});
	});
	describe('Arrays', function () {
		it('Simple array', function () {
			const o = parse( "[123]" );
			//console.log( "o is", o );
			expect(o).to.deep.equal([123]);
		});
	});
});

describe('Parsing with reviver', function () {
	it('With simple reviver', function () {
		const results = [];
		const o = parse( "{\"a\":{\"b\":{\"c\":{\"d\":123}, e:456}, f:789}, g: 987}", function (a, b) {
			results.push([a, b]);
			//console.log( a, b );
			return b;
		} );
		//console.log( "o is", JSON.stringify( o ) );

		expect(o).to.deep.equal({
			a: {b: {c: {d: 123}, e:456}, f:789}, g: 987
		});
		expect(results).to.deep.equal([
			['d', 123],
			['c', {d: 123}],
			['e', 456],
			['b', {c: {d: 123}, e:456}],
			['f', 789],
			['a', {b: {c: {d: 123}, e:456}, f:789}],
			['g', 987],
			['', {a: {b: {c: {d: 123}, e:456}, f:789}, g: 987}],
		]);
	});
	it('Reviver which deletes', function () {
		const results = [];
		// Add temporarily to prototype to check coverage of
		//   `hasOwnProperty` filter
		Object.prototype.ttt = function () {};
		const o = parse('{a: {b: {c: 5}, d: 8}}', function (a, b) {
			results.push([a, b]);
			if (a === 'd') {
				return undefined;
			}
			return b;
		} );
		//console.log( "o is", JSON.stringify( o ) );
		delete Object.prototype.ttt;

		expect(o).to.deep.equal({
			a: {b: {c: 5}}
		});

		expect(results).to.deep.equal([
			['c', 5],
			['b', {
				c: 5
			}],
			['d', 8],
			['a', {
				b: {
					c: 5
				}
			}],
			['', {
				a: {
					b: {
						c: 5
					}
				}
			}]
		]);
	});
});
