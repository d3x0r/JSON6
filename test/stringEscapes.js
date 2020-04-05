'use strict';
var JSON6 = require( '..' );

describe('String escapes', function () {
    describe('Octal escapes', function () {
        it('Parses string octal escape', function () {
            var result = JSON6.parse( '"\\056"' );
            expect(result).to.deep.equal('.');
        });
    });
    describe('Unicode wide escapes', function () {
        it('Parses Unicode wide escape (lower-case)', function () {
            var result = JSON6.parse( '"\\u{002e}"' );
            expect(result).to.deep.equal('.');
        });
        it('Parses Unicode wide escape (upper-case)', function () {
            var result = JSON6.parse( '"\\u{002E}"' );
            expect(result).to.deep.equal('.');
        });
        it('Throws with bad Unicode wide escape (upper-case)', function () {
            expect(function () {
                JSON6.parse( '"\\u{00G}"' );
            }).to.throw(Error, /escaped character, parsing hex/);
        });
    });
    describe('String hex escapes', function () {
        it('Parses string hex', function () {
            var result = JSON6.parse( '"\\x2e"' );
            expect(result).to.deep.equal('.');
        });
    });
    describe('Single escapes', function () {
        it('\\b', function () {
            var result = JSON6.parse( '"\\b"' );
            expect(result).to.deep.equal('\b');
        });
        it('\\f', function () {
            var result = JSON6.parse( '"\\f"' );
            expect(result).to.deep.equal('\f');
        });
    });
});
