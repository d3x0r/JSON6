'use strict';
var JSON = require( '..' );

describe('Numbers', function () {
    it('Decimal', function () {
        var n = .123;
        console.log( "typeof( n ) =", typeof n, n );


        var result = JSON.parse( '.123' );
        console.log( "typeof( result ) =", typeof result, result );

        expect(result).to.equal(n);
    });
    it('Positive decimal', function () {
        var n = +.123;
        console.log( "typeof( n ) =", typeof n, n );

        var result = JSON.parse( '+.123' );
        console.log( "typeof( result ) =", typeof result, result );

        expect(result).to.equal(n);
    });

    it('Negative decimal', function () {
        var n = -.123;
        console.log( "typeof( n ) =", typeof n, n );

        var result = JSON.parse( '-.123' );
        console.log( "typeof( result ) =", typeof result, result );

        expect(result).to.equal(n);
    });

    it('Decimal with scientific notation', function () {
        var n = .123e3;
        console.log( "typeof( n ) =", typeof n, n );

        var result = JSON.parse( '.123e3' );
        console.log( "typeof( result ) =", typeof result, result );

        expect(result).to.equal(n);
    });

    it('Decimal ending prematurely (throws)', function () {
        expect(function () {
            JSON.parse( '14g' );
        }).to.throw(Error);
    });

    it('Decimal with bad scientific notation (throws)', function () {
        expect(function () {
            JSON.parse( '1ee' );
        }).to.throw(Error);
    });

    it('Decimal with positive scientific notation', function () {
        var n = .123e+3;
        console.log( "typeof( n ) =", typeof n, n );

        var result = JSON.parse( '.123e+3' );
        console.log( "typeof( result ) =", typeof result, result );

        expect(result).to.equal(n);
    });

    it('Decimal with negative scientific notation', function () {
        var n = .123e-3;
        console.log( "typeof( n ) =", typeof n, n );

        var result = JSON.parse( '.123e-3' );
        console.log( "typeof( result ) =", typeof result, result );

        expect(result).to.equal(n);
    });

    it('Hexadecimal', function () {
        var n = 0x123;
        console.log( "typeof( n ) =", typeof n, n );

        var result = JSON.parse( '0x123' );
        console.log( "typeof( result ) =", typeof result, result );

        expect(result).to.equal(n);
    });

    function failSuccess( string ) {
        it('Fails with "' + string + '"', function () {
            expect(function () {
                var result = JSON.parse( string );
                console.log( "typeof( result ) =", typeof result, result );
            }).to.throw(Error);
        });
    }

    failSuccess( ".123-45" );
    failSuccess( ".123e2-45" );
    failSuccess( ".123e--45" );
    failSuccess( ".123e+-45" );
    failSuccess( ".123e3-45" );
    failSuccess( ".05x23" );
    failSuccess( "0xx23" );
    failSuccess( "0x23.45" );
});
