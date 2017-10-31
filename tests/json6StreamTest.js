
var JSON6 = require( ".." );
var parser = JSON6.begin( (obj)=>{
	console.log( "Got value:",typeof obj, ":", obj );
} );

parser.write( '"This ' );
parser.write( 'is a Test"' );

parser.write( '[1234,12');
parser.write( '34,1234]');

parser.write( '[123,4');
parser.write( '56,78');
parser.write( '9,"abc","de');
parser.write( 'f","ghi"]');


parser.write( 'true false null undefined NaN Infinity' );

parser.write( "1 " );
parser.write( "123" );
parser.write( '"1"' );

parser.write( '{ a:12' );
parser.write( '34 }' );

parser.write( '{ long');
parser.write( 'key:1234 }' );

parser.write( '{ a:1234 }' );
console.log( "4 objects..." );
parser.write( '{ a:1234 }{ b:34 }{c:1}{d:123}' );
console.log( "got 4 objects?" );

try {
	parser.write( 'truefalse' );
} catch(err) {
	console.log( "success error", err );
}

parser.reset();
parser.write( '1_234 0x55_33_22_11 0x1234 ' );

