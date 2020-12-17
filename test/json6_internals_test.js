'use strict';
const JSON6 = require( ".." );

// this is more about coverage than failure/success.
// internally there can be multiple outstanding buffer segments to process, this just makes sure we can do that.
// Failure is any thrown error.

describe('JSON6.streaming.internal', function () {
	it('requeues input buffers for pending inputs', function () {
		const results = [];
		const parser = JSON6.begin();
		let parseResult;

		parseResult = parser._write( "1 2 3 " );
		results.push( parseResult );
		results.push( parser.value() );

		parseResult = parser._write( "1 2 3 4 5 " );
		results.push( parseResult );
		results.push( parser.value() );

		parseResult = parser._write( "1 2 3 " );
		parseResult = parser._write();
		results.push( parseResult );
		results.push( parser.value() );

		while( (parseResult = parser._write()) ) {
			//console.log( "Leftover Data:", parser.value() );
		}

		// and now, there will be a 'saved' which push() can pull from.
		parseResult = parser._write( "1 " );
		//console.log( "Leftover Data:", parser.value() );


		expect(results.join(",")).to.equal("2,1,2,2,1,3");
	});
});
