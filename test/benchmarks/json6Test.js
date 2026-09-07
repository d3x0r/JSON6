'use strict';
const { expect } = require( 'chai' );
const JSON6 = require( "../../" );

describe('Benchmarking', function () {
	this.timeout(20000);
	it('Benchmarking', function () {
		const start = Date.now();
		let result1, result2, result3;
		for( let n = 0; n < 1000000; n++ ) {
			result1 = JSON6.parse( "{\"a\":{\"b\":{\"c\":{\"d\":123}}}}" );
			result2 = JSON6.parse( '"Simple String value"' );
			result3 = JSON6.parse( '123456789' );
		}

		const end = Date.now();
		console.log( "1m in ", end - start );
		expect(result1).to.deep.equal({
			a: {b: {c: {d: 123}}}
		});
		expect(result2).to.equal('Simple String value');
		expect(result3).to.equal(123456789);
	});
});
