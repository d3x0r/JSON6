
var JSON6 = require( "./json6.js" );

var lastval;
var skip_out = true;
var parser = JSON6.begin( (val)=>{
	lastval = val;
	if( !skip_out )
		console.log( "got value:", val );
} );

var complexSplit = `[
   "db",
   {
      "_": {
         "#": "db",
         ">": {
            "j6bjv": 1502678337047
         }
      },
      "j6bjr5rg": {
         "#": "j6bjzqK"
      }
   }
]`;

var testOut = JSON.stringify( JSON.parse( complexSplit ) );
var testOut2 = JSON.stringify( JSON6.parse( complexSplit ) );
if( testOut != testOut2 )
	console.log( "INITIAL FAIL" );

for( var n = 0; n < complexSplit.length; n++ ) {
	var a = complexSplit.substr( 0, n );
	var b = complexSplit.substr( n );
	parser.write( a );
	parser.write( b );
	if( JSON.stringify( lastval ) != testOut )
		console.log( "FAILED REASSEMBLY AT", n , '\n got:\n', JSON.stringify( lastval ), '\n Original:\n', testOut );
	//console.log( "Tested:", JSON.stringify(a), JSON.stringify(b));
}

skip_out = false;
parser.write( '[]' );
parser.write( '[,]' );
parser.write( '[,,]' );

parser.write( `[
   "db",
   {
      "_": {
         "#": "db",
         ">": {
            "j6bjv": 1502678337047
         }
      },
      "j6bjr` );

parser.write( `5rg": {
         "#": "j6bjzqK"
      }
   }
]`);


        
parser.write( "123" );

parser.write( "[\n   null,\n   null\n]" );

parser.write( '"Hello ' );   // a broken simple value string, results as 'Hello World!' 
parser.write( 'World!"' );
parser.write( '{ first: 1,' );   // a broken structure
parser.write( ' second : 2 }' );
parser.write( '[1234,12');  // a broken array across a value
parser.write( '34,1234]'); 
parser.write( '1234 456 789 123 523');  // multiple single simple values that are numbers
parser.write( '{a:1} {b:2} {c:3}');  // multiple objects

parser.write( '1234' );  // this won't return immediately, there might be more numeric data.
parser.write( '' ); // flush any pending numbers; if an object or array or string was split, throws an error; missing close.

parser.write( '1234' ); 
parser.write( '5678 ' );  // at this point, the space will flush the number value '12345678' 

var start = Date.now();
var n;
for( n = 0; n < 1000000; n++ ) {
	JSON6.parse( "{\"a\":{\"b\":{\"c\":{\"d\":123}}}}" );
	JSON6.parse( '"Simple String value"' );
	JSON6.parse( '123456789' );
}

var end = Date.now();
console.log( "1m in ", end-start );
