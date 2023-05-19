'use strict';

const { expect } = require( 'chai' );
const JSON = require( "../../" );

describe('Number tests (with benchmarking)', function () {
	this.timeout(10000);
	it('Negative decimal', function () {
		console.log( JSON.parse( "-1234" ) );
		const start = Date.now();
		let result;
		for( let m = 0; m < 40; m++ )
			for( let n = 0; n < 100000; n++ )
				result = JSON.parse( "-1234" );

		console.log( "took:", Date.now() - start );
		expect(result).to.equal(-1234);
	});

	it('Negative decimal (single loop)', function () {
		console.log( JSON.parse( "-1234" ) );
		const start = Date.now();
		let result;
		for( let n = 0; n < 2000000; n++ )
			result = JSON.parse( "-1234" );
		console.log( "took:", Date.now() - start );
		expect(result).to.equal(-1234);
	});

	it('Decimal', function () {
		console.log( JSON.parse( "1234" ) );
		const start = Date.now();
		let result;
		for( let m = 0; m < 40; m++ )
			for( let n = 0; n < 100000; n++ )
				result = JSON.parse( "1234" );
		console.log( "took:", Date.now() - start );
		expect(result).to.equal(1234);
	});

	it('Decimal (single loop)', function () {
		console.log( JSON.parse( "1234" ) );
		const start = Date.now();
		let result;
		for( let n = 0; n < 2000000; n++ )
			result = JSON.parse( "1234" );
		console.log( "took:", Date.now() - start );
		expect(result).to.equal(1234);
	});

	it('Simple object with number', function () {
		console.log( JSON.parse( "{a:1234}" ) );
		const start = Date.now();
		let result;
		for( let n = 0; n < 2000000; n++ )
			result = JSON.parse( "{a:1234}" );
		console.log( "took:", Date.now() - start );
		expect(result).to.deep.equal({
			a: 1234
		});
	});

	it('Simple object with negative number', function () {
		console.log( JSON.parse( "{a:-1234}" ) );
		const start = Date.now();
		let result;
		for( let n = 0; n < 2000000; n++ )
			result = JSON.parse( "{a:-1234}" );
		console.log( "took:", Date.now() - start );
		expect(result).to.deep.equal({
			a: -1234
		});
	});

	it('Simple array with number', function () {
		console.log( JSON.parse( "[1234]" ) );
		const start = Date.now();
		let result;
		for( let n = 0; n < 2000000; n++ )
			result = JSON.parse( "[1234]" );
		console.log( "took:", Date.now() - start );
		expect(result).to.deep.equal([1234]);
	});

	it('Simple array with negative number', function () {
		console.log( JSON.parse( "[-1234]" ) );
		const start = Date.now();
		let result;
		for( let n = 0; n < 2000000; n++ )
			result = JSON.parse( "[-1234]" );
		console.log( "took:", Date.now() - start );
		expect(result).to.deep.equal([-1234]);
	});


	it('Simple object with decimal', function () {
		console.log( JSON.parse( "{a:0.1234}" ) );
		const start = Date.now();
		let result;
		for( let n = 0; n < 1000000; n++ )
			result = JSON.parse( "{a:0.1234}" );
		console.log( "took:", Date.now() - start );
		expect(result).to.deep.equal({a: 0.1234});
	});

	it('Simple object with negative octal treated as decimal', function () {
		console.log( JSON.parse( "{a:-01234}" ) );
		const start = Date.now();
		let result;
		for( let n = 0; n < 1009000; n++ )
			result = JSON.parse( "{a:-01234}" );
		console.log( "took:", Date.now() - start );
		expect(result).to.deep.equal({a: -1234});
	});

	it('Simple array with negative hexadecimal', function () {
		console.log( JSON.parse( "[-0x1f9d]" ) );
		const start = Date.now();
		let result;
		for( let m = 0; m < 20; m++ )
			for( let n = 0; n < 100000; n++ )
				result = JSON.parse( "[-0x1f9d]" );
		console.log( "took:", Date.now() - start );
		expect(result).to.deep.equal([-0x1f9d]);
	});

	// console.log( "Waiting forever..." );
	// function wait() { setTimeout( wait, 2000 ) }
	// wait();
});
