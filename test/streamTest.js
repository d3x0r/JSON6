'use strict';
const JSON6 = require( '..' );
const fs = require( 'fs' );
const path = require( 'path' );

const buf = fs.readFileSync( path.join(__dirname, 'stream.json6') );
const msg = buf.toString( 'utf8' );

describe('Streaming', function () {
	it('Streams various objects', function () {
		const results = [];
		const parser = JSON6.begin(function (val) {
			//console.log( "Got Object:", val );
			results.push(val);
		});

		for(
			let result = parser.write( msg );
			result > 0;
			parser.write()
		);

		expect(results).to.deep.equal([
			123,
			456,
			789,
			1234,
			['a','b','c'],
			'This\nis\na\ntest',
			{ a: { b : { c : { d : 123 }, e: [154,452] }, f : 942 }, g: 'Final' }
		]);
	});
	it('Converts non-string to string and attempts to process', function () {
		const results = [];
		const parser = JSON6.begin(function (val) {
			//console.log( "Got Object:", val );
			results.push(val);
		});

		expect(function () {
			parser.write({});
		}).to.throw(Error, /fault parsing 'o' unexpected/);
	});
	it('handles incomplete string key in chunks', function () {
		const results = [];
		const parser = JSON6.begin(function (val) {
			//console.log( "Got Object:", val );
			results.push(val);
		});

		for(
			let result = parser.write( '{"' );
			result > 0;
			parser.write()
		);
		parser.write( 'a' );
		parser.write( '"' );

		expect(results).to.deep.equal([]);
	});
	it('Supports reviver', function () {
		const results = [];
		const parser = JSON6.begin(function (/*val*/) {
			//console.log( "Got Object:", val );
		}, function (a, b) {
			results.push([a, b]);
			if (a === 'd') {
				return undefined;
			}
			return b;
		} );

		// Add temporarily to prototype to check coverage of
		//   `hasOwnProperty` filter
		Object.prototype.ttt = function () {};
		parser.write('{a: {b: {c: 5}, d: 8}}');
		delete Object.prototype.ttt;

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
