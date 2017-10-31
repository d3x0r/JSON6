
var JSON6 = require( ".." );

try {
	var result = JSON6.parse( "{ my- key:3}" );
	console.log( "result:", result );
} catch( err ) {
	console.log( 'error expected:', err.message );
}

try {
	var result = JSON6.parse( "{ my -  key:3}" );
	console.log( "result:", result );
} catch( err ) {
	console.log( 'error expected:', err.message );
}

var result = JSON6.parse( "{ 'my  -  key':3}" );
console.log( "result:", result );

var result = JSON6.parse( "{ my-key\\m&m+*|:3}" );
console.log( "result:", result );
