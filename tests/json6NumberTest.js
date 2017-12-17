
var JSON = require( ".." );
var start;



console.log( JSON.parse( "-1234" ) );
start = Date.now();
for( var m = 0; m < 40; m++ )
	for( n = 0; n < 100000; n++ )
		JSON.parse( "-1234" );
console.log( "took:", Date.now() - start );

console.log( JSON.parse( "1234" ) );
start = Date.now();
for( var m = 0; m < 40; m++ )
	for( n = 0; n < 100000; n++ )
		JSON.parse( "1234" );
console.log( "took:", Date.now() - start );


console.log( JSON.parse( "{a:1234}" ) );
start = Date.now();
	for( n = 0; n < 2000000; n++ )
		JSON.parse( "{a:1234}" );
console.log( "took:", Date.now() - start );




console.log( JSON.parse( "{a:-1234}" ) );
start = Date.now();
	for( n = 0; n < 2000000; n++ )
		JSON.parse( "{a:-1234}" );
console.log( "took:", Date.now() - start );


console.log( JSON.parse( "[1234]" ) );
start = Date.now();
	for( n = 0; n < 2000000; n++ )
		JSON.parse( "[1234]" );
console.log( "took:", Date.now() - start );

console.log( JSON.parse( "[-1234]" ) );
start = Date.now();
	for( n = 0; n < 2000000; n++ )
		JSON.parse( "[-1234]" );
console.log( "took:", Date.now() - start );




console.log( JSON.parse( "-1234" ) );
start = Date.now();
	for( n = 0; n < 2000000; n++ )
		JSON.parse( "-1234" );
console.log( "took:", Date.now() - start );

console.log( JSON.parse( "1234" ) );
start = Date.now();
	for( n = 0; n < 2000000; n++ )
		JSON.parse( "1234" );
console.log( "took:", Date.now() - start );



console.log( JSON.parse( "{a:0.1234}" ) );
start = Date.now();
	for( n = 0; n < 1000000; n++ )
		JSON.parse( "{a:0.1234}" );
console.log( "took:", Date.now() - start );

console.log( JSON.parse( "{a:-01234}" ) );
start = Date.now();
	for( n = 0; n < 1009000; n++ )
		JSON.parse( "{a:-01234}" );
console.log( "took:", Date.now() - start );


console.log( JSON.parse( "[01234e3]" ) );
start = Date.now();
	for( n = 0; n < 1000000; n++ )
		JSON.parse( "[01234e3]" );
console.log( "took:", Date.now() - start );

console.log( JSON.parse( "[-0x1234]" ) );
start = Date.now();
for( var m = 0; m < 20; m++ )
	for( n = 0; n < 100000; n++ )
		JSON.parse( "[-0x1234]" );
console.log( "took:", Date.now() - start );


//console.log( "Waiting forever..." );
//function wait() { setTimeout( wait, 2000 ) }
//wait();
