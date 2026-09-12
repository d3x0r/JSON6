'use strict';
const { expect } = require( 'chai' );
const JSON6 = require( '..' );

const parse = JSON6.parse;
const STRICT = { esStrictCompatible: true };

describe('esStrictCompatible option', function () {
	describe('Legacy-octal / leading-zero numbers', function () {
		it('accepts a leading-zero number by default (decimal)', function () {
			expect( parse( '0123' ) ).to.equal( 123 );
			expect( parse( '[-0123]' ) ).to.deep.equal( [ -123 ] );
			expect( parse( '{a: 0123}' ) ).to.deep.equal( { a: 123 } );
		});
		it('rejects a leading-zero number when esStrictCompatible', function () {
			expect(function () {
				parse( '0123', undefined, STRICT );
			}).to.throw( Error, /leading-zero numbers are not allowed/ );
		});
		it('rejects `00` when esStrictCompatible', function () {
			expect(function () {
				parse( '00', undefined, STRICT );
			}).to.throw( Error, /leading-zero numbers are not allowed/ );
		});
		it('still accepts a bare zero, decimal, and radix prefixes when esStrictCompatible', function () {
			expect( parse( '0', undefined, STRICT ) ).to.equal( 0 );
			expect( parse( '0.5', undefined, STRICT ) ).to.equal( 0.5 );
			expect( parse( '0e1', undefined, STRICT ) ).to.equal( 0 );
			expect( parse( '0x1F', undefined, STRICT ) ).to.equal( 31 );
		});
	});

	describe('Legacy octal string escapes', function () {
		it('strips them by default', function () {
			expect( parse( '"\\056"' ) ).to.equal( '\0' + '56' );
			expect( parse( '"\\1"' ) ).to.equal( '1' );
		});
		it('rejects `\\0` followed by a digit when esStrictCompatible', function () {
			expect(function () {
				parse( '"\\056"', undefined, STRICT );
			}).to.throw( Error, /Legacy octal string escapes/ );
		});
		it('rejects `\\1` through `\\9` when esStrictCompatible', function () {
			expect(function () {
				parse( '"\\1"', undefined, STRICT );
			}).to.throw( Error, /Legacy octal string escapes/ );
			expect(function () {
				parse( '"\\9"', undefined, STRICT );
			}).to.throw( Error, /Legacy octal string escapes/ );
		});
		it('still accepts a lone `\\0` (NUL) and unknown escapes when esStrictCompatible', function () {
			expect( parse( '"\\0"', undefined, STRICT ) ).to.equal( '\0' );
			expect( parse( '"\\0A"', undefined, STRICT ) ).to.equal( '\0A' );
			expect( parse( '"\\!"', undefined, STRICT ) ).to.equal( '!' );
		});
	});

	describe('Literal line terminators inside single- or double-quoted strings', function () {
		it('keeps them by default', function () {
			expect( parse( "{a:'abc\ndef'}" ) ).to.deep.equal( { a: 'abc\ndef' } );
		});
		it('rejects a literal LF / CR when esStrictCompatible', function () {
			expect(function () {
				parse( '"a\nb"', undefined, STRICT );
			}).to.throw( Error, /Literal line terminators/ );
			expect(function () {
				parse( "'a\rb'", undefined, STRICT );
			}).to.throw( Error, /Literal line terminators/ );
		});
		it('still allows a literal line/paragraph separator when esStrictCompatible', function () {
			// legal, unescaped, in a string literal since ES2019 (the JSON-superset proposal)
			expect( parse( '"a' + String.fromCharCode( 0x2028 ) + 'b"', undefined, STRICT ) )
				.to.equal( 'a' + String.fromCharCode( 0x2028 ) + 'b' );
			expect( parse( '"a' + String.fromCharCode( 0x2029 ) + 'b"', undefined, STRICT ) )
				.to.equal( 'a' + String.fromCharCode( 0x2029 ) + 'b' );
		});
		it('still allows literal newlines inside a backtick string when esStrictCompatible', function () {
			expect( parse( '`a\nb`', undefined, STRICT ) ).to.equal( 'a\nb' );
		});
	});

	describe('Backtick-quoted object keys', function () {
		it('accepts a backtick key by default', function () {
			expect( parse( '{`a`:123}' ) ).to.deep.equal( { a: 123 } );
		});
		it('rejects a backtick key when esStrictCompatible', function () {
			expect(function () {
				parse( '{`a`:123}', undefined, STRICT );
			}).to.throw( Error, /Backtick-quoted keys are not allowed/ );
		});
		it('still allows a backtick-quoted value when esStrictCompatible', function () {
			expect( parse( '{a:`b`}', undefined, STRICT ) ).to.deep.equal( { a: 'b' } );
		});
	});

	describe('Unquoted keys that are not valid identifiers', function () {
		it('accepts a hyphenated key by default', function () {
			expect( parse( '{a-b:1}' ) ).to.deep.equal( { 'a-b': 1 } );
		});
		it('rejects a hyphenated key when esStrictCompatible', function () {
			expect(function () {
				parse( '{a-b:1}', undefined, STRICT );
			}).to.throw( Error, /Unquoted keys must be valid identifiers/ );
		});
		it('rejects a key that starts with a digit when esStrictCompatible', function () {
			expect(function () {
				parse( '{1x:1}', undefined, STRICT );
			}).to.throw( Error, /Unquoted keys must be valid identifiers/ );
		});
		it('still accepts identifier, numeric, and quoted keys when esStrictCompatible', function () {
			expect( parse( '{ _a$B0 : 1 }', undefined, STRICT ) ).to.deep.equal( { _a$B0: 1 } );
			expect( parse( '{ 123: 1 }', undefined, STRICT ) ).to.deep.equal( { 123: 1 } );
			expect( parse( '{ "a-b": 1 }', undefined, STRICT ) ).to.deep.equal( { 'a-b': 1 } );
		});
	});

	describe('Multiple consecutive unary signs', function () {
		it('accepts stacked signs by default', function () {
			expect( parse( '--5' ) ).to.equal( 5 );
			expect( parse( '---5' ) ).to.equal( -5 );
		});
		it('rejects `--5`, `+-5`, `++5` when esStrictCompatible', function () {
			expect(function () {
				parse( '--5', undefined, STRICT );
			}).to.throw( Error, /Multiple consecutive signs/ );
			expect(function () {
				parse( '+-5', undefined, STRICT );
			}).to.throw( Error, /Multiple consecutive signs/ );
			expect(function () {
				parse( '++5', undefined, STRICT );
			}).to.throw( Error, /Multiple consecutive signs/ );
		});
		it('rejects signs separated only by whitespace when esStrictCompatible', function () {
			expect(function () {
				parse( '- - 5', undefined, STRICT );
			}).to.throw( Error, /Multiple consecutive signs/ );
		});
		it('still accepts a single leading sign when esStrictCompatible', function () {
			expect( parse( '-5', undefined, STRICT ) ).to.equal( -5 );
			expect( parse( '+5', undefined, STRICT ) ).to.equal( 5 );
			expect( parse( '-   5', undefined, STRICT ) ).to.equal( -5 );
			expect( parse( '-Infinity', undefined, STRICT ) ).to.equal( -Infinity );
			expect( parse( '-NaN', undefined, STRICT ) ).to.be.NaN;
		});
		it('clears the sign guard between successive values (esStrictCompatible)', function () {
			expect( parse( '[-1,-2]', undefined, STRICT ) ).to.deep.equal( [ -1, -2 ] );
			expect( parse( '{a:-1,b:-2}', undefined, STRICT ) ).to.deep.equal( { a: -1, b: -2 } );
			expect( parse( '[[-1],-2]', undefined, STRICT ) ).to.deep.equal( [ [ -1 ], -2 ] );
			expect( parse( '[-Infinity, -Infinity]', undefined, STRICT ) ).to.deep.equal( [ -Infinity, -Infinity ] );
		});
		it('clears the sign guard between streamed top-level values (esStrictCompatible)', function () {
			/** @type {unknown[]} */
			const results = [];
			const parser = JSON6.begin( function ( v ) {
				results.push( v );
			}, undefined, STRICT );
			parser.write( '-1 ' );
			parser.write( '-2 ' );
			expect( results ).to.deep.equal( [ -1, -2 ] );
		});
	});

	describe('forbidTemplateSubstitution option', function () {
		it('takes `${` as literal text by default', function () {
			expect( parse( '`a${b}`' ) ).to.equal( 'a${b}' );
			expect( parse( '`a${b}`', undefined, STRICT ) ).to.equal( 'a${b}' );
		});
		it('rejects an unescaped `${` in a backtick string when set', function () {
			expect(function () {
				parse( '`a${b}`', undefined, { forbidTemplateSubstitution: true } );
			}).to.throw( Error, /Template substitution/ );
		});
		it('is independent of esStrictCompatible', function () {
			expect(function () {
				parse( '`a${b}`', undefined, { esStrictCompatible: true, forbidTemplateSubstitution: true } );
			}).to.throw( Error, /Template substitution/ );
		});
		it('does not flag `$` not followed by `{`, or `{` not preceded by `$`', function () {
			const opts = { forbidTemplateSubstitution: true };
			expect( parse( '`a$b`', undefined, opts ) ).to.equal( 'a$b' );
			expect( parse( '`a$`', undefined, opts ) ).to.equal( 'a$' );
			expect( parse( '`a{b`', undefined, opts ) ).to.equal( 'a{b' );
		});
		it('does not flag an escaped `\\${`', function () {
			expect( parse( '`a\\${b}`', undefined, { forbidTemplateSubstitution: true } ) ).to.equal( 'a${b}' );
		});
		it('ignores `${` outside of backtick strings', function () {
			expect( parse( '"a${b}"', undefined, { forbidTemplateSubstitution: true } ) ).to.equal( 'a${b}' );
		});
	});

	describe('warnWithCommentWithoutEOL option', function () {
		/**
		 * @param {string} text
		 * @param {{ warnWithCommentWithoutEOL?: boolean }} [opts]
		 * @returns {unknown[][]}
		 */
		function captureLog( text, opts ) {
			/** @type {unknown[][]} */
			const logged = [];
			const origLog = console.log;
			console.log = function (/** @type {unknown[]} */ ...args) { logged.push(args); };
			try {
				// a document that is only a `//` comment has no value, so this
				// always throws; the warning (if any) is logged before the throw.
				expect(function () { parse( text, undefined, opts ); }).to.throw(Error, /No value found/);
			} finally {
				console.log = origLog;
			}
			return logged;
		}
		it('is silent by default for a `//` comment that ends the document', function () {
			expect( captureLog( '//' ) ).to.deep.equal( [] );
		});
		it('warns when the option is set', function () {
			const logged = captureLog( '//', { warnWithCommentWithoutEOL: true } );
			expect( logged ).to.have.lengthOf( 1 );
			expect( logged[0][0] ).to.match( /comment without end of line/ );
		});
	});

	describe('option plumbing through begin()/reset()', function () {
		it('honors options passed to begin() for streaming input', function () {
			const parser = JSON6.begin( undefined, undefined, STRICT );
			expect(function () {
				parser._write( '0123', true );
			}).to.throw( Error, /leading-zero numbers are not allowed/ );
		});
		it('keeps begin() options in effect across a bare reset()', function () {
			const parser = JSON6.begin( undefined, undefined, STRICT );
			parser._write( '"split' );
			parser.reset();
			expect(function () {
				parser._write( '0123', true );
			}).to.throw( Error, /leading-zero numbers are not allowed/ );
		});
		it('lets reset(options) override begin() options', function () {
			const parser = JSON6.begin( undefined, undefined, STRICT );
			parser.reset( {} );
			expect( parser._write( '0123', true ) ).to.be.above( 0 );
			expect( parser.value() ).to.equal( 123 );
		});
	});
});
