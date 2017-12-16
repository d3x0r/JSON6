

var JSON6 = require( ".." )
var parse = JSON6.parse;

//console.log( "Stringify Test:", vfs.JSON.stringify( { a:123 } ) );

//var x = '[' + JSON.stringify( new Date() ) + ']';
//console.log( "Date Output is:", x, JSON.stringify( new Date() ) );

var o = parse( "123" );
console.log( "123 is", o, typeof o );
var o = parse( "123_456_789" );
console.log( "123_456_789 is", o, typeof o );
var o = parse( "0123" );
console.log( "0123 is", o, typeof o );
var o = parse( "0o123" );
console.log( "0o123 is", o, typeof o );
var o = parse( "0x123" );
console.log( "0x123 is", o, typeof o );
var o = parse( "0b1010101" );
console.log( "0b1010101 is", o, typeof o );
var o = parse( "\"123\"" );
console.log( "o is", o, typeof o );
var o = parse( "null" );
console.log( "o is", o, typeof o );
var o = parse( "true" );
console.log( "o is", o, typeof o );
var o = parse( "false" );
console.log( "o is", o, typeof o );

var o = parse( "undefined" );
console.log( "o is", o, typeof o );

	var o = parse( "NaN" );
	console.log( "o is", o, typeof o );
	var o = parse( "-NaN" );
	console.log( "o is", o, typeof o );
	var o = parse( "Infinity" );
	console.log( "o is", o, typeof o );
	var o = parse( "-Infinity" );
	console.log( "o is", o, typeof o );

var o = parse( "{a:123}" );
console.log( "o is", o );

var o = parse( "{a:`abcdef`}" );
console.log( "o is", o );
var o = parse( "{a:\"abcdef\"}" );
console.log( "o is", o );

var o = parse( "{a:'abc\ndef'}" );
console.log( "o is", o );
var o = parse( "{a:'abc\\\ndef'}" );
console.log( "o is", o );
var o = parse( "{a:'abc\\\r\ndef'}" );
console.log( "o is", o );

var o = parse( "{\"a\":123}" );
console.log( "o is", o );
var o = parse( "[123]" );
console.log( "o is", o );
var o = parse( "{\"a\":{\"b\":{\"c\":{\"d\":123}, e:456}, f:789}, g: 987}", (a,b)=>{
	console.log( a, b ); return b;
} );
console.log( "o is", JSON.stringify( o ) );


// benchmark - needs some work; ended up somewhat divergent.
if(true)
{

var start = Date.now();
var n;
for( n = 0; n < 1000000; n++ ) {
	parse( "{\"a\":{\"b\":{\"c\":{\"d\":123}}}}" );
	//parse( '"Simple String Value."' );
}
var end = Date.now();
console.log( "1m in ", end-start );

var start = Date.now();
var n;
for( n = 0; n < 1000000; n++ ) {
	parse( "[1,[2,[3,[4,5]]]]" );
	//parse( '"Simple String Value."' );
}
var end = Date.now();
console.log( "1m in ", end-start );



var translations = ["{\"a\":{\"b\":{\"c\":{\"d\":123}}}}","{\"a\":{\"b\":{\"c\":{\"d\":123}}}}","{\"a\":{\"b\":{\"c\":{\"d\":123}}}}","{\"a\":{\"b\":{\"c\":{\"d\":123}}}}"];
var ntrans = 0;

start = end;
for( n = 0; n < 5000000; n++ ) {
	JSON.parse( "{\"a\":{\"b\":{\"c\":{\"d\":123}}}}" );
	//JSON.parse( translations[ntrans] );
        //ntrans = (ntrans+1)&3;
}
end = Date.now();
console.log( "1m in ", end-start );
}

var start = Date.now();
var n;
for( n = 0; n < 5000000; n++ ) {
	JSON.parse( "[1,[2,[3,[4,5]]]]" );
	//parse( '"Simple String Value."' );
}
var end = Date.now();
console.log( "1m in ", end-start );



var varObjects = [];
for( var n = 0; n < 100000; n++ ) {
	varObjects.push( `{\"a${n}\":{\"b${n}\":{\"c${n}\":{\"d${n}\":123}}}}` );
}

var varStrings = [];
for( var n = 0; n < 100000; n++ ) {
	varStrings.push( `"SImple STring Value ${n}"` );
}

var varNumbers = [];
for( var n = 0; n < 100000; n++ ) {
	varNumbers.push( `${n}` );
}

// benchmark - needs some work; ended up somewhat divergent.
if(true)
{

var start = Date.now();
var n;
for( n = 0; n < 500000; n++ ) {
	parse( varObjects[n%100000] );
	//parse( varStrings[n%100000] );
	//parse( varNumbers[n%100000] );
	//parse( "{\"a\":{\"b\":{\"c\":{\"d\":123}}}}" );
	//parse( '"Simple String value"' );
	//parse( '123456789' );
}

var end = Date.now();
console.log( "1m in ", end-start );


start = end;
for( n = 0; n < 500000; n++ ) {
	JSON.parse( varObjects[n%100000] );
	//JSON.parse( varStrings[n%100000] );
	//JSON.parse( varNumbers[n%100000] );
	/*JSON.parse( "{\"a\":{\"b\":{\"c\":{\"d\":123}}}}" );*/
	//JSON.parse( '"Simple String value"' );
        //JSON.parse( '123456789' );
}
end = Date.now();
console.log( "1m in ", end-start );
}



