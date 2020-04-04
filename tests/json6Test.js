var JSON6 = require( ".." )
var parse = JSON6.parse;

//console.log( "Stringify Test:", vfs.JSON.stringify( { a:123 } ) );

//var x = '[' + JSON.stringify( new Date() ) + ']';
//console.log( "Date Output is:", x, JSON.stringify( new Date() ) );

describe('Basic parsing', function () {
	describe('Numbers', function () {
	  	it('Simple decimal', function () {
		  	var o = parse( "123" );
		  	console.log( "123 is", o, typeof o );
			expect(o).to.equal(123);
	  	});
		it('Decimal with separators', function () {
			var o = parse( "123_456_789" );
			console.log( "123_456_789 is", o, typeof o );
		  	expect(o).to.equal(123456789);
		});
		it('Leading zero octals', function () {
			var o = parse( "0123" );
  		  	console.log( "0123 is", o, typeof o );
			expect(o).to.equal(83);
		});
		it('Leading zero-o octals', function () {
			var o = parse( "0o123" );
  		  	console.log( "0o123 is", o, typeof o );
			expect(o).to.equal(83);
		});
		it('Hexadecimal', function () {
			var o = parse( "0x123" );
  		  	console.log( "0x123 is", o, typeof o );
			expect(o).to.equal(291);
		});
		it('Binary', function () {
			var o = parse( "0b1010101" );
			console.log( "0b1010101 is", o, typeof o );
			expect(o).to.equal(85);
		});
	});
	describe('Special numbers', function () {
		it('NaN', function () {
			var o = parse( "NaN" );
		  	console.log( "o is", o, typeof o );
			expect(o).to.be.NaN;
		});
		it('-NaN', function () {
			var o = parse( "-NaN" );
		  	console.log( "o is", o, typeof o );
			expect(o).to.be.NaN;
		});
		it('Infinity', function () {
			var o = parse( "Infinity" );
		  	console.log( "o is", o, typeof o );
			expect(o).to.equal(Infinity);
		});
		it('-Infinity', function () {
			var o = parse( "-Infinity" );
		  	console.log( "o is", o, typeof o );
			expect(o).to.equal(-Infinity);
		});
	});
	describe('Strings', function () {
	  	it('String as number', function () {
		  	var o = parse( "\"123\"" );
  			console.log( "o is", o, typeof o );
			expect(o).to.equal('123');
	  	});
	});
	describe('Other', function () {
		it('null', function () {
			var o = parse( "null" );
			console.log( "o is", o, typeof o );
			expect(o).to.be.null;
		});
		it('true', function () {
			var o = parse( "true" );
			console.log( "o is", o, typeof o );
			expect(o).to.be.true;
		});
		it('false', function () {
			var o = parse( "false" );
			console.log( "o is", o, typeof o );
			expect(o).to.be.false;
		});
		it('undefined', function () {
			var o = parse( "undefined" );
			console.log( "o is", o, typeof o );
			expect(o).to.be.undefined;
		});
	});
	describe('Objects', function () {
		it('Decimal key value', function () {
			var o = parse( "{a:123}" );
			console.log( "o is", o );
			expect(o).to.deep.equal({ a:123 });
		});
		it('ES6 template key value', function () {
			var o = parse( "{a:`abcdef`}" );
			console.log( "o is", o );
			expect(o).to.deep.equal({ a: 'abcdef' });
		});

		it('Double-quoted key value', function () {
			var o = parse( "{a:\"abcdef\"}" );
			console.log( "o is", o );
			expect(o).to.deep.equal({ a: 'abcdef' });
		});

		it('Single-quoted key value (with newline)', function () {
			var o = parse( "{a:'abc\ndef'}" );
			console.log( "o is", o );
			expect(o).to.deep.equal({ a: 'abc\ndef' });
		});

		it('Single-quoted key value (with trailing backslash and newline)', function () {
			var o = parse( "{a:'abc\\\ndef'}" );
			console.log( "o is", o );
			expect(o).to.deep.equal({ a: 'abcdef' });
		});

		it('Single-quoted key value with backslash, carriage return, and newline', function () {
			var o = parse( "{a:'abc\\\r\ndef'}" );
			console.log( "o is", o );
			expect(o).to.deep.equal({ a: 'abcdef' });
		});

		it('Double-quoted key', function () {
			var o = parse( "{\"a\":123}" );
			console.log( "o is", o );
			expect(o).to.deep.equal({ a: 123 });
		});
	});
	describe('Arrays', function () {
	  	it('Simple array', function () {
		  	var o = parse( "[123]" );
			console.log( "o is", o );
			expect(o).to.deep.equal([123]);
	  	});
	});
});

describe('Parsing with reviver', function () {
  	it('With simple reviver', function () {
		var results = [];
		var o = parse( "{\"a\":{\"b\":{\"c\":{\"d\":123}, e:456}, f:789}, g: 987}", function (a, b) {
			results.push([a, b]);
			console.log( a, b ); return b;
		} );
		console.log( "o is", JSON.stringify( o ) );

  	  	expect(o).to.deep.equal({
			a: {b: {c: {d: 123}, e:456}, f:789}, g: 987
		});
		expect(results).to.deep.equal([
			['d', 123],
			['c', {d: 123}],
			['e', 456],
			['b', {c: {d: 123}, e:456}],
			['f', 789],
			['a', {b: {c: {d: 123}, e:456}, f:789}],
			['g', 987],
			['', {a: {b: {c: {d: 123}, e:456}, f:789}, g: 987}],
		]);
  	});
});


// benchmark - needs some work; ended up somewhat divergent.
describe('Benchmark', function () {
	this.timeout(20000);
  	it('Benchmark nested objects', function () {
		var start = Date.now();
		var n;
		var result;
		for( n = 0; n < 1000000; n++ ) {
			result = parse( "{\"a\":{\"b\":{\"c\":{\"d\":123}}}}" );
			//parse( '"Simple String Value."' );
		}
		var end = Date.now();
		console.log( "1m in ", end-start );
		expect(result).to.deep.equal({
			a: {b: {c: {d: 123}}}}
		);

		var start = Date.now();
		var n;
		for( n = 0; n < 1000000; n++ ) {
			result = parse( "[1,[2,[3,[4,5]]]]" );
			//parse( '"Simple String Value."' );
		}
		var end = Date.now();
		console.log( "1m in ", end-start );
		expect(result).to.deep.equal([1,[2,[3,[4,5]]]]);


		// var translations = ["{\"a\":{\"b\":{\"c\":{\"d\":123}}}}","{\"a\":{\"b\":{\"c\":{\"d\":123}}}}","{\"a\":{\"b\":{\"c\":{\"d\":123}}}}","{\"a\":{\"b\":{\"c\":{\"d\":123}}}}"];
		// var ntrans = 0;

		start = end;
		for( n = 0; n < 5000000; n++ ) {
			result = JSON.parse( "{\"a\":{\"b\":{\"c\":{\"d\":123}}}}" );
			//JSON.parse( translations[ntrans] );
		        //ntrans = (ntrans+1)&3;
		}
		end = Date.now();
		console.log( "1m in ", end-start );
		expect(result).to.deep.equal({
			a: {b: {c: {d: 123}}}
		});
  	});
	it('Benchmark nested array', function () {
		var start = Date.now();
		var n;
		var result;
		for( n = 0; n < 5000000; n++ ) {
			result = JSON.parse( "[1,[2,[3,[4,5]]]]" );
			//parse( '"Simple String Value."' );
		}
		var end = Date.now();
		console.log( "1m in ", end-start );
		expect(result).to.deep.equal(
			[1, [2, [3, [4, 5]]]]
		);
	});
	// benchmark - needs some work; ended up somewhat divergent.
	it('Benchmark nested object with numeric keys', function () {
		var varObjects = [];
		for( var n = 0; n < 100000; n++ ) {
			varObjects.push(
				'{"a' + n + '":{"b' + n + '":{"c' + n + '":{"d' + n + '":123}}}}'
			);
		}

		/*
		var varStrings = [];
		for( var n = 0; n < 100000; n++ ) {
			varStrings.push( `"SImple STring Value ${n}"` );
		}

		var varNumbers = [];
		for( var n = 0; n < 100000; n++ ) {
			varNumbers.push( `${n}` );
		}
		*/


		var start = Date.now();
		var n;
		for( n = 0; n < 500000; n++ ) {
			parse( varObjects[n % 100000] );
			// parse( varStrings[n%100000] );
			// parse( varNumbers[n%100000] );
			// parse( "{\"a\":{\"b\":{\"c\":{\"d\":123}}}}" );
			// parse( '"Simple String value"' );
			// parse( '123456789' );
		}

		var end = Date.now();
		console.log( "1m in ", end-start );


		start = end;
		for( n = 0; n < 500000; n++ ) {
			JSON.parse( varObjects[n % 100000] );
			// JSON.parse( varStrings[n%100000] );
			// JSON.parse( varNumbers[n%100000] );
			/* JSON.parse( "{\"a\":{\"b\":{\"c\":{\"d\":123}}}}" );*/
			// JSON.parse( '"Simple String value"' );
	        // JSON.parse( '123456789' );
		}
		end = Date.now();
		console.log( "1m in ", end - start );
		expect(true).to.be.true;
	});
});
