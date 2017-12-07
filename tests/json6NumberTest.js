
var JSON = require( ".." );
var start;

console.log( JSON.parse( "-1234" ) );
start = Date.now();
for( var m = 0; m < 20; m++ )
	for( n = 0; n < 100000; n++ )
		JSON.parse( "-1234" );
console.log( "took:", Date.now() - start );

console.log( JSON.parse( "1234" ) );
start = Date.now();
for( var m = 0; m < 20; m++ )
	for( n = 0; n < 100000; n++ )
		JSON.parse( "1234" );
console.log( "took:", Date.now() - start );



console.log( JSON.parse( "{a:1234}" ) );
start = Date.now();
for( var m = 0; m < 20; m++ )
	for( n = 0; n < 100000; n++ )
		JSON.parse( "{a:1234}" );
console.log( "took:", Date.now() - start );

console.log( JSON.parse( "{a:-1234}" ) );
start = Date.now();
for( var m = 0; m < 20; m++ )
	for( n = 0; n < 100000; n++ )
		JSON.parse( "{a:-1234}" );
console.log( "took:", Date.now() - start );


console.log( JSON.parse( "[1234]" ) );
start = Date.now();
for( var m = 0; m < 20; m++ )
	for( n = 0; n < 100000; n++ )
		JSON.parse( "[1234]" );
console.log( "took:", Date.now() - start );

console.log( JSON.parse( "[-1234]" ) );
start = Date.now();
for( var m = 0; m < 20; m++ )
	for( n = 0; n < 100000; n++ )
		JSON.parse( "[-1234]" );
console.log( "took:", Date.now() - start );
