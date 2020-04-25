'use strict';

var string = "012359599323";

describe('String benchmarks', function () {
	this.timeout(10000);
	it('String index access', function () {
		var start = Date.now();
		for( var m = 0; m < 10000; m++ )
			for( var n = 0; n < 100000; n++ )
				if( string[0] === '0' );
		var end = Date.now();
		console.log( "1m in ", end-start );
	});
	it('String charCode access', function () {
		var start = Date.now();
		for( var m = 0; m < 10000; m++ )
			for( var n = 0; n < 100000; n++ )
				if( string.charCodeAt(0) === 48 );
		var end = Date.now();

		console.log( "1m in ", end-start );
	});
});
