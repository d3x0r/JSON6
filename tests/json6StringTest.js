
const sack = require( ".." );
const JSON6 = require( ".." );//sack.JSON6;

var parser = JSON6.begin( (data)=>{
	console.log( "Test 123456 = ", data );
} );
//parser.write( "\'\\x31\\062\\u{33}\\u003456\'" )
//var string = "\'\\x31\\062\\u{33}\\u003456\'";
//for( var n = 0; n < string.length; n++ )
//	parser.write( string[n] );

function test1() {
console.log( "Output1:", JSON6.parse( '"Simple String value"' ) );
var start = Date.now();
var n;
for( n = 0; n < 1000000; n++ ) {
	JSON6.parse( '"Simple String value"' );
}
var end = Date.now();
console.log( "1m in ", end-start );


var start = Date.now();
var n;
for( n = 0; n < 1000000; n++ ) {
	JSON.parse( '"Simple String value"' );
}
var end = Date.now();
console.log( "1m in ", end-start );

}

function test2() {
console.log( "Output2:", JSON6.parse( '"Si\\t \\r\\n   lue"' ) );
var start = Date.now();
var n;
for( n = 0; n < 1000000; n++ ) {
	JSON6.parse( '"Si\\t \\r\\n   lue"' );
}

var end = Date.now();
console.log( "1m in ", end-start );

var start = Date.now();
var n;
for( n = 0; n < 1000000; n++ ) {
	JSON.parse( '"Si\\t \\r\\n   lue"' );
}

var end = Date.now();
console.log( "1m in ", end-start );

setTimeout( test1, 10 );

}

setTimeout( test2, 10 );


//console.log( "Waiting forever..." );
//function wait() { setTimeout( wait, 2000 ) }
//wait();
