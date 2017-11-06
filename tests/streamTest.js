
var JSON6 = require( '..' );
var fs = require( 'fs' );

var buf = fs.readFileSync( 'stream.json' );
var msg = buf.toString( 'utf8' );
var parser = JSON6.begin( (val)=>{
	console.log( "Got Object:", val );
})

for( var result = parser.write( msg );
	result > 0; parser.write() );

