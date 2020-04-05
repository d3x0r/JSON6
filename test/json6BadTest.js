'use strict';
var JSON6 = require( ".." );

var parse = JSON6.parse;
var o;

describe('Bad tests', function () {

    it('Unquoted keyword', function () {
        expect(function () {
            o = parse( "{ true:1 }" );
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

    it('Array after string?', function () {
        expect(function () {
            o = parse( "{ a  : 'no quote' [1] }" );
            console.log( "got back:", o );
        }).to.throw(Error);
    });
});
