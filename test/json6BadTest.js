'use strict';
const JSON6 = require( ".." );

const parse = JSON6.parse;
let o;

describe('Bad tests', function () {

	it('space error', function () {
		expect(function () {
			o = parse( "tr " );
			console.log( "got back:", o );
		}).to.throw(Error);

		expect(function () {
			o = parse( "[tr ]" );
			console.log( "got back:", o );
		}).to.throw(Error);
		expect(function () {
			o = parse( "{a:tr }" );
			console.log( "got back:", o );
		}).to.throw(Error);
	} );

	it('Non-matching keyword (true)', function () {
		expect(function () {
			o = parse( "tt" );
			console.log( "got back:", o );
		}).to.throw(Error);

		expect(function () {
			o = parse( "trr" );
			console.log( "got back:", o );
		}).to.throw(Error);

		expect(function () {
			o = parse( "truu" );
			console.log( "got back:", o );
		}).to.throw(Error);

		expect(function () {
			o = parse( "truee" );
			console.log( "got back:", o );
		}).to.throw(Error);
	});

	it('Non-matching keyword (false)', function () {
		expect(function () {
			o = parse( "ff" );
			console.log( "got back:", o );
		}).to.throw(Error);

		expect(function () {
			o = parse( "faa" );
			console.log( "got back:", o );
		}).to.throw(Error);

		expect(function () {
			o = parse( "fall" );
			console.log( "got back:", o );
		}).to.throw(Error);

		expect(function () {
			o = parse( "falss" );
			console.log( "got back:", o );
		}).to.throw(Error);

		expect(function () {
			o = parse( "falsee" );
			console.log( "got back:", o );
		}).to.throw(Error);
	});

	it('Non-matching keyword (null)', function () {
		expect(function () {
			o = parse( "nn" );
			console.log( "got back:", o );
		}).to.throw(Error);

		expect(function () {
			o = parse( "nuu" );
			console.log( "got back:", o );
		}).to.throw(Error);

		expect(function () {
			o = parse( "nulll" );
			console.log( "got back:", o );
		}).to.throw(Error);
	});

	it('Non-matching keyword (undefined)', function () {
		expect(function () {
			o = parse( "uu" );
			console.log( "got back:", o );
		}).to.throw(Error);

		expect(function () {
			o = parse( "unn" );
			console.log( "got back:", o );
		}).to.throw(Error);

		expect(function () {
			o = parse( "undd" );
			console.log( "got back:", o );
		}).to.throw(Error);

		expect(function () {
			o = parse( "undee" );
			console.log( "got back:", o );
		}).to.throw(Error);

		expect(function () {
			o = parse( "undeff" );
			console.log( "got back:", o );
		}).to.throw(Error);

		expect(function () {
			o = parse( "undefii" );
			console.log( "got back:", o );
		}).to.throw(Error);

		expect(function () {
			o = parse( "undefinn" );
			console.log( "got back:", o );
		}).to.throw(Error);

		expect(function () {
			o = parse( "undefinee" );
			console.log( "got back:", o );
		}).to.throw(Error);

		expect(function () {
			o = parse( "undefinedd" );
			console.log( "got back:", o );
		}).to.throw(Error);
	});

	it('Non-matching keyword (NaN)', function () {
		expect(function () {
			o = parse( "NN" );
			console.log( "got back:", o );
		}).to.throw(Error);

		expect(function () {
			o = parse( "Naa" );
			console.log( "got back:", o );
		}).to.throw(Error);

		expect(function () {
			o = parse( "NaNN" );
			console.log( "got back:", o );
		}).to.throw(Error);
	});

	it('Non-matching keyword (Infinity)', function () {
		expect(function () {
			o = parse( "II" );
			console.log( "got back:", o );
		}).to.throw(Error);

		expect(function () {
			o = parse( "Infinityy" );
			console.log( "got back:", o );
		}).to.throw(Error);

		expect(function () {
			o = parse( "-Infinity-" );
			console.log( "got back:", o );
		}).to.throw(Error);
	});

	it('Unquoted space in identifier', function () {
		expect(function () {
			o = parse( "{ a b:1 }" );
			console.log( "got back:", o );
		}).to.throw(Error);
	});

	it('Missing colon?', function () {
		expect(function () {
			o = parse( "{ a[3], b:1 }" );
			console.log( "got back:", o );
		}).to.throw(Error);
	});

	it('Missing colon?', function () {
		expect(function () {
			o = parse( "{ a{c:3}, b:1 }" );
			console.log( "got back:", o );
		}).to.throw(Error);
	});

	it('String unquoted?', function () {
		expect(function () {
			o = parse( "{ a  : no quote }" );
			console.log( "got back:", o );
		}).to.throw(Error);
	});

	it('String unquoted?', function () {
		expect(function () {
			o = parse( "a" );
			console.log( "got back:", o );
		}).to.throw(Error);
	});

	it('Non-BMP unquoted String', function () {
		expect(function () {
			parse( "\u{10FFFF}" );
		}).to.throw(Error);
	});

	it('Throws with colon in array', function () {
		expect(function () {
			parse( "[:]" );
		}).to.throw(Error);
	});

	it('Throws with colon outside objects', function () {
		expect(function () {
			parse( ":" );
		}).to.throw(Error);
	});

	it('Throws with comma outside objects', function () {
		expect(function () {
			parse( "," );
		}).to.throw(Error, /excessive commas/);
	});

	it('Throws with curly bracket outside objects', function () {
		expect(function () {
			parse( "}" );
		}).to.throw(Error);
	});

	it('Out of place ZWNBS (in keyword state)', function () {
		expect(function () {
			JSON6.parse( "tru\uFEFF" );
		}).to.throw(Error, /fault parsing whitespace/);
	});

	it('Array after string?', function () {
		expect(function () {
			o = parse( "{ a  : 'no quote' [1] }" );
			console.log( "got back:", o );
		}).to.throw(Error);
	});

	it('comma after object field and : ', function () {
		expect(function () {
			o = parse( "{a:,}" );
			console.log( "got back:", o );
		}).to.throw(Error);
	});

	it('object close after object field and : ', function () {
		expect(function () {
			o = parse( "{a:}" );
			console.log( "got back:", o );
		}).to.throw(Error);
	});

	it('bad hex escape : ', function () {
		expect(function () {
			o = parse( "'\\x1Z'" );
			console.log( "got back:", o );
		}).to.throw(Error);
	});

	it('bad unicode escape : ', function () {
		expect(function () {
			o = parse( "'\\u01Zz'" );
			console.log( "got back:", o );
		}).to.throw(Error);
	});


	it('throws with quoted field name after no comma : ', function () {
		expect(function () {
			o = parse( '{ "a": { "a": 5 }   "abc": { "a": 5  } }' );
		}).to.throw(Error,/String unexpected/);
	});

	it('throws with unquoted field name after no comma: ', function () {
		expect(function () {
			o = parse( '{ "a": { "a": 5 }   abc: { "a": 5  } }' );
		}).to.throw(Error,/fault parsing 'a' unexpected at/);
	});



});
