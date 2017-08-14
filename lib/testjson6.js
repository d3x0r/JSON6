
var JSON6 = require( "./json6.js" );

var parser = JSON6.begin( (val)=>{
	console.log( "got value:", val );
} );

parser.add( `[
   "db",
   {
      "_": {
         "#": "db",
         ">": {
            "j6bjv": 1502678337047
         }
      },
      "j6bjr` );

parser.add( `5rg": {
         "#": "j6bjzqK"
      }
   }
]`);


        
parser.add( "123" );

parser.add( "[\n   null,\n   null\n]" );

parser.add( '"Hello ' );   // a broken simple value string, results as 'Hello World!' 
parser.add( 'World!"' );
parser.add( '{ first: 1,' );   // a broken structure
parser.add( ' second : 2 }' );
parser.add( '[1234,12');  // a broken array across a value
parser.add( '34,1234]'); 
parser.add( '1234 456 789 123 523');  // multiple single simple values that are numbers
parser.add( '{a:1} {b:2} {c:3}');  // multiple objects

parser.add( '1234' );  // this won't return immediately, there might be more numeric data.
parser.add( '' ); // flush any pending numbers; if an object or array or string was split, throws an error; missing close.

parser.add( '1234' ); 
parser.add( '5678 ' );  // at this point, the space will flush the number value '12345678' 

var start = Date.now();
var n;
for( n = 0; n < 1000000; n++ ) {
	JSON6.parse( "{\"a\":{\"b\":{\"c\":{\"d\":123}}}}" );
	JSON6.parse( '"Simple String value"' );
	JSON6.parse( '123456789' );
}

var end = Date.now();
console.log( "1m in ", end-start );
