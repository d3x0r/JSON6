
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

console.log( '-------' );

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

function failSuccess( string ) {
	try {
		var n = JSON.parse( string );
		console.log( "typeof( n ) =", typeof n, n );
	} catch(err) {
		console.log( "Expected failure :", err.message );
	}
}

failSuccess( ".123-45" );
failSuccess( ".123e2-45" );
failSuccess( ".123e--45" );
failSuccess( ".123e+-45" );
failSuccess( ".123e3-45" );
failSuccess( ".05x23" );
failSuccess( "0xx23" );
failSuccess( "0x23.45" );
