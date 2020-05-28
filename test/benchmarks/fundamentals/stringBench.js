'use strict';

const string = "012359599323";

describe('String benchmarks', function () {
	this.timeout(10000);
	it('String index access', function () {
		const start = Date.now();
		for( let m = 0; m < 10000; m++ )
			for( let n = 0; n < 100000; n++ )
				if( string[0] === '0' );
		const end = Date.now();
		console.log( "1B in ", end-start );
	});
	it('String charCode access', function () {
		const start = Date.now();
		for( let m = 0; m < 10000; m++ )
			for( let n = 0; n < 100000; n++ )
				if( string.charCodeAt(0) === 48 );
		const end = Date.now();

		console.log( "1B in ", end-start );
	});
});
