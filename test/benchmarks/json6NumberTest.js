'use strict';

var JSON = require( "../../" );
var n;
var start;

describe('Number tests (with benchmarking)', function () {
	this.timeout(10000);
	it('Negative decimal', function () {
		console.log( JSON.parse( "-1234" ) );
		start = Date.now();
		var result;
		for( var m = 0; m < 40; m++ )
			for( n = 0; n < 100000; n++ )
				result = JSON.parse( "-1234" );

		console.log( "took:", Date.now() - start );
		expect(result).to.equal(-1234);
	});

	it('Negative decimal (single loop)', function () {
		console.log( JSON.parse( "-1234" ) );
		start = Date.now();
		var result;
		for( n = 0; n < 2000000; n++ )
			result = JSON.parse( "-1234" );
		console.log( "took:", Date.now() - start );
		expect(result).to.equal(-1234);
	});

	it('Decimal', function () {
		console.log( JSON.parse( "1234" ) );
		start = Date.now();
		var result;
		for( var m = 0; m < 40; m++ )
			for( n = 0; n < 100000; n++ )
				result = JSON.parse( "1234" );
		console.log( "took:", Date.now() - start );
		expect(result).to.equal(1234);
	});

	it('Decimal (single loop)', function () {
		console.log( JSON.parse( "1234" ) );
		start = Date.now();
		var result;
		for( n = 0; n < 2000000; n++ )
			result = JSON.parse( "1234" );
		console.log( "took:", Date.now() - start );
		expect(result).to.equal(1234);
	});

	it('Simple object with number', function () {
		console.log( JSON.parse( "{a:1234}" ) );
		start = Date.now();
		var result;
		for( n = 0; n < 2000000; n++ )
			result = JSON.parse( "{a:1234}" );
		console.log( "took:", Date.now() - start );
		expect(result).to.deep.equal({
			a: 1234
		});
	});

	it('Simple object with negative number', function () {
		console.log( JSON.parse( "{a:-1234}" ) );
		start = Date.now();
		var result;
		for( n = 0; n < 2000000; n++ )
			result = JSON.parse( "{a:-1234}" );
		console.log( "took:", Date.now() - start );
		expect(result).to.deep.equal({
			a: -1234
		});
	});

	it('Simple array with number', function () {
		console.log( JSON.parse( "[1234]" ) );
		start = Date.now();
		var result;
		for( n = 0; n < 2000000; n++ )
			result = JSON.parse( "[1234]" );
		console.log( "took:", Date.now() - start );
		expect(result).to.deep.equal([1234]);
	});

	it('Simple array with negative number', function () {
		console.log( JSON.parse( "[-1234]" ) );
		start = Date.now();
		var result;
		for( n = 0; n < 2000000; n++ )
			result = JSON.parse( "[-1234]" );
		console.log( "took:", Date.now() - start );
		expect(result).to.deep.equal([-1234]);
	});


	it('Simple object with decimal', function () {
		console.log( JSON.parse( "{a:0.1234}" ) );
		start = Date.now();
		var result;
		for( n = 0; n < 1000000; n++ )
			result = JSON.parse( "{a:0.1234}" );
		console.log( "took:", Date.now() - start );
		expect(result).to.deep.equal({a: 0.1234});
	});

	it('Simple object with negative octal treated as decimal', function () {
		console.log( JSON.parse( "{a:-01234}" ) );
		start = Date.now();
		var result;
		for( n = 0; n < 1009000; n++ )
			result = JSON.parse( "{a:-01234}" );
		console.log( "took:", Date.now() - start );
		expect(result).to.deep.equal({a: -1234});
	});

	it('Simple array with negative hexadecimal', function () {
		console.log( JSON.parse( "[-0x1234]" ) );
		start = Date.now();
		var result;
		for( var m = 0; m < 20; m++ )
			for( n = 0; n < 100000; n++ )
				result = JSON.parse( "[-0x1234]" );
		console.log( "took:", Date.now() - start );
		expect(result).to.deep.equal([-4660]);
	});

	// console.log( "Waiting forever..." );
	// function wait() { setTimeout( wait, 2000 ) }
	// wait();
});
