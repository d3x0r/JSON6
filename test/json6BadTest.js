'use strict';
const JSON6 = require( ".." );

const parse = JSON6.parse;

describe('Bad tests', function () {

	it('space error', function () {
		expect(function () {
			parse( "tr " );
		}).to.throw(Error);

		expect(function () {
			parse( "[tr ]" );
		}).to.throw(Error);
		expect(function () {
			parse( "{a:tr }" );
		}).to.throw(Error);
	} );

	it('Non-matching keyword (true)', function () {
		expect(function () {
			parse( "tt" );
		}).to.throw(Error);

		expect(function () {
			parse( "trr" );
		}).to.throw(Error);

		expect(function () {
			parse( "truu" );
		}).to.throw(Error);

		expect(function () {
			parse( "truee" );
		}).to.throw(Error);
	});

	it('Non-matching keyword (false)', function () {
		expect(function () {
			parse( "ff" );
		}).to.throw(Error);

		expect(function () {
			parse( "faa" );
		}).to.throw(Error);

		expect(function () {
			parse( "fall" );
		}).to.throw(Error);

		expect(function () {
			parse( "falss" );
		}).to.throw(Error);

		expect(function () {
			parse( "falsee" );
		}).to.throw(Error);
	});

	it('Non-matching keyword (null)', function () {
		expect(function () {
			parse( "nn" );
		}).to.throw(Error);

		expect(function () {
			parse( "nuu" );
		}).to.throw(Error);

		expect(function () {
			parse( "nulll" );
		}).to.throw(Error);
	});

	it('Non-matching keyword (undefined)', function () {
		expect(function () {
			parse( "uu" );
		}).to.throw(Error);

		expect(function () {
			parse( "unn" );
		}).to.throw(Error);

		expect(function () {
			parse( "undd" );
		}).to.throw(Error);

		expect(function () {
			parse( "undee" );
		}).to.throw(Error);

		expect(function () {
			parse( "undeff" );
		}).to.throw(Error);

		expect(function () {
			parse( "undefii" );
		}).to.throw(Error);

		expect(function () {
			parse( "undefinn" );
		}).to.throw(Error);

		expect(function () {
			parse( "undefinee" );
		}).to.throw(Error);

		expect(function () {
			parse( "undefinedd" );
		}).to.throw(Error);
	});

	it('Non-matching keyword (NaN)', function () {
		expect(function () {
			parse( "NN" );
		}).to.throw(Error);

		expect(function () {
			parse( "Naa" );
		}).to.throw(Error);

		expect(function () {
			parse( "NaNN" );
		}).to.throw(Error);
	});

	it('Non-matching keyword (Infinity)', function () {
		expect(function () {
			parse( "II" );
		}).to.throw(Error);

		expect(function () {
			parse( "Infinityy" );
		}).to.throw(Error);

		expect(function () {
			parse( "-Infinity-" );
		}).to.throw(Error);
	});

	it('Unquoted space in identifier', function () {
		expect(function () {
			parse( "{ a b:1 }" );
		}).to.throw(Error);
	});

	it('Missing colon?', function () {
		expect(function () {
			parse( "{ a[3], b:1 }" );
		}).to.throw(Error);
	});

	it('Missing colon?', function () {
		expect(function () {
			parse( "{ a{c:3}, b:1 }" );
		}).to.throw(Error);
	});

	it('String unquoted?', function () {
		expect(function () {
			parse( "{ a  : no quote }" );
		}).to.throw(Error);
	});

	it('String unquoted?', function () {
		expect(function () {
			parse( "a" );
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
			parse( "{ a  : 'no quote' [1] }" );
		}).to.throw(Error);
	});

	it('comma after object field and : ', function () {
		expect(function () {
			parse( "{a:,}" );
		}).to.throw(Error);
	});

	it('object close after object field and : ', function () {
		expect(function () {
			parse( "{a:}" );
		}).to.throw(Error);
	});

	it('bad hex escape : ', function () {
		expect(function () {
			parse( "'\\x1Z'" );
		}).to.throw(Error);
	});

	it('bad unicode escape : ', function () {
		expect(function () {
			parse( "'\\u01Zz'" );
		}).to.throw(Error);
	});


	it('throws with quoted field name after no comma : ', function () {
		expect(function () {
			parse( '{ "a": { "a": 5 }   "abc": { "a": 5  } }' );
		}).to.throw(Error,/String unexpected/);
	});

	it('throws with unquoted field name after no comma: ', function () {
		expect(function () {
			parse( '{ "a": { "a": 5 }   abc: { "a": 5  } }' );
		}).to.throw(Error,/fault parsing 'a' unexpected at/);
	});



});
