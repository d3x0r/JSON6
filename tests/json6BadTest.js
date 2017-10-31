
var JSON6 = require( ".." )


var parse = JSON6.parse;

var o;
try {
	o = parse( "{ true:1 }" );
	console.log( "got back:", o );
} catch( err ) { console.log( "Expected error, unquoted keyword", err ); }



try {
	o = parse( "{ a b:1 }" );
	console.log( "got back:", o );
} catch( err ) { console.log( "Expected error, unquoted space in identifier", err ); }

try {
	o = parse( "{ a[3], b:1 }" );
	console.log( "got back:", o );
} catch( err ) { console.log( "Expected error, missing colon?", err ); }


try {
	o = parse( "{ a{c:3}, b:1 }" );
	console.log( "got back:", o );
} catch( err ) { console.log( "Expected error, missing colon?", err ); }

try {
	o = parse( "{ a  : no quote }" );
	console.log( "got back:", o );
} catch( err ) { console.log( "Expected error, string unquoted?", err ); }

try {
	o = parse( "a" );
	console.log( "got back:", o );
} catch( err ) { console.log( "Expected error, string unquoted?", err ); }

try {
	o = parse( "{ a  : 'no quote' [1] }" );
	console.log( "got back:", o );
} catch( err ) { console.log( "Expected error, array after string?", err ); }
