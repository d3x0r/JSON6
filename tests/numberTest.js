
var JSON = require( '..' );

var n = .123;
console.log( "typeof( n ) =", typeof n, n );

var n = +.123;
console.log( "typeof( n ) =", typeof n, n );

var n = -.123;
console.log( "typeof( n ) =", typeof n, n );

var n = .123e3;
console.log( "typeof( n ) =", typeof n, n );

var n = .123e-3;
console.log( "typeof( n ) =", typeof n, n );

var n = 0x123;
console.log( "typeof( n ) =", typeof n, n );

var n = JSON.parse( '.123' );
console.log( "typeof( n ) =", typeof n, n );

var n = JSON.parse( '+.123' );
console.log( "typeof( n ) =", typeof n, n );

var n = JSON.parse( '-.123' );
console.log( "typeof( n ) =", typeof n, n );

var n = JSON.parse( '.123e3' );
console.log( "typeof( n ) =", typeof n, n );

var n = JSON.parse( '.123e-3' );
console.log( "typeof( n ) =", typeof n, n );

var n = JSON.parse( '0x123' );
console.log( "typeof( n ) =", typeof n, n );
