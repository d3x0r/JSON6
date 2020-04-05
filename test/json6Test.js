'use strict';
var JSON6 = require( ".." );
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
        it('Decimal with bad character', function () {
            expect(function () {
                parse( "12\u{10FFFF}" );
            }).to.throw(Error, /fault while parsing number/);
        });
        it('Decimal with separators', function () {
            var o = parse( "123_456_789" );
            console.log( "123_456_789 is", o, typeof o );
            expect(o).to.equal(123456789);
        });
        it('Leading zero octals', function () {
            var o = parse( "0123" );
            var withinArr = parse( "[0123]" );
            var withinObj = parse( "{a: 0123}" );
            var negO = parse( "-0123" );
            var negWithinArr = parse( "[-0123]" );
            var negWithinObj = parse( "{a: -0123}" );
            console.log( "0123 is", o, typeof o );
            expect(o).to.equal(83);
            expect(withinArr).to.deep.equal([83]);
            expect(withinObj).to.deep.equal({a: 83});
            expect(negO).to.equal(-83);
            expect(negWithinArr).to.deep.equal([-83]);
            expect(negWithinObj).to.deep.equal({a: -83});
        });

        it('Ignores treating zero octals as such when feature is disabled', function () {
            JSON6.supportLeadingOctals(false);
            var o = parse( "0123" );
            var withinArr = parse( "[0123]" );
            var withinObj = parse( "{a: 0123}" );
            var negO = parse( "-0123" );
            var negWithinArr = parse( "[-0123]" );
            var negWithinObj = parse( "{a: -0123}" );
            JSON6.supportLeadingOctals(true);
            console.log( "0123 is", o, typeof o );
            expect(o).to.equal(123);
            expect(withinArr).to.deep.equal([123]);
            expect(withinObj).to.deep.equal({a: 123});
            expect(negO).to.equal(-123);
            expect(negWithinArr).to.deep.equal([-123]);
            expect(negWithinObj).to.deep.equal({a: -123});
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
        it('String with non-BMP characters', function () {
            var o = parse( "\"\u{10FFFF}\"" );
            console.log( "o is", o, typeof o );
            expect(o).to.equal('\u{10FFFF}');
        });
    });
    describe('Comments', function () {
        it('Should throw with incomplete comment', function () {
            expect(function () {
                parse( "/a" );
            }).to.throw(Error);
        });
        it('Should throw with incomplete comment with 2 asterisks', function () {
            expect(function () {
                parse( "/**a" );
            }).to.throw(Error);
        });
        it('Should throw with incomplete comment with 3 asterisks', function () {
            expect(function () {
                parse( "/***" );
            }).to.throw(Error);
        });
        it('Should handle comment', function () {
            var o = parse( "/**/" );
            console.log( "o is", o, typeof o );
            expect(o).to.equal(undefined);
        });
    });
    describe('Other', function () {
        it('null', function () {
            var o = parse( "null" );
            console.log( "o is", o, typeof o );
            expect(o).to.be.null;
        });
        it('null as `null`', function () {
            var o = parse( null );
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
        describe('Keys', function () {
            it('Double-quoted key', function () {
                var o = parse( "{\"a\":123}" );
                console.log( "o is", o );
                expect(o).to.deep.equal({ a: 123 });
            });
            it('Back-tick quoted key', function () {
                var o = parse( "{`a`:123}" );
                console.log( "o is", o );
                expect(o).to.deep.equal({ a: 123 });
            });
            it('Carriage return within key', function () {
                var o = parse( "{\ra:123}" );
                console.log( "o is", o );
                expect(o).to.deep.equal({ a: 123 });
            });
            it('Newline within key', function () {
                var o = parse( "{\na:123}" );
                console.log( "o is", o );
                expect(o).to.deep.equal({ a: 123 });
            });
            it('Should throw with extra single quotes within key', function () {
                expect(function () {
                    parse( "{''':123}" );
                }).to.throw(Error);
            });
        });
        describe('Key values', function () {
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
    it('Reviver which deletes', function () {
        var results = [];
        // Add temporarily to prototype to check coverage of
        //   `hasOwnProperty` filter
        Object.prototype.ttt = function () {};
        var o = parse('{a: {b: {c: 5}, d: 8}}', function (a, b) {
            results.push([a, b]);
            if (a === 'd') {
                return undefined;
            }
            return b;
        } );
        console.log( "o is", JSON.stringify( o ) );
        delete Object.prototype.ttt;

        expect(o).to.deep.equal({
            a: {b: {c: 5}}
        });

        expect(results).to.deep.equal([
            ['c', 5],
            ['b', {
                c: 5
            }],
            ['d', 8],
            ['a', {
                b: {
                    c: 5
                }
            }],
            ['', {
                a: {
                    b: {
                        c: 5
                    }
                }
            }]
        ]);
    });
});
