var JSON6 = require( '..' );
var fs = require( 'fs' );
var path = require( 'path' );

var buf = fs.readFileSync( path.join(__dirname, 'stream.json6') );
var msg = buf.toString( 'utf8' );

describe('Streaming', function () {
	it('Streams various objects', function () {
		var results = [];
		var parser = JSON6.begin(function (val) {
			console.log( "Got Object:", val );
			results.push(val);
		});

		for(
			var result = parser.write( msg );
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
});
