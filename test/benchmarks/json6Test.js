var JSON6 = require( "../../" )

describe('Benchmarking', function () {
    this.timeout(10000);
    it('Benchmarking', function () {
		var start = Date.now();
		var n;
        var result1, result2, result3;
		for( n = 0; n < 1000000; n++ ) {
			result1 = JSON6.parse( "{\"a\":{\"b\":{\"c\":{\"d\":123}}}}" );
			result2 = JSON6.parse( '"Simple String value"' );
			result3 = JSON6.parse( '123456789' );
		}

		var end = Date.now();
		console.log( "1m in ", end - start );
        expect(result1).to.deep.equal({
            a: {b: {c: {d: 123}}}
        });
        expect(result2).to.equal('Simple String value');
        expect(result3).to.equal(123456789);
	});
});
