
var negative = true

const val = { string : "1234", negative : false };



start = Date.now();
for( var m = 0; m < 5000; m++ ) {val.negative = m&1;
for( var n = 0; n < 100000; n++ )
	//negative?-Number( "1234" ):Number("1234");
	val.negative?-Number(val.string):Number(val.string);
}
console.log( "took:", Date.now() - start );

var start = Date.now();

for( var m = 0; m < 5000; m++ ) { val.negative = m&1;
for( var n = 0; n < 100000; n++ )
	(val.negative?-1:1) * Number(val.string);
	//Number("1234") * (negative?-1:1);
}
console.log( "took:", Date.now() - start );



var start = Date.now();

for( var m = 0; m < 5000; m++ ) { val.negative = m&1;
for( var n = 0; n < 100000; n++ )
	Number(val.string) * (val.negative?-1:1);
	//Number("1234") * (negative?-1:1);
}
console.log( "took:", Date.now() - start );




start = Date.now();
for( var m = 0; m < 5000; m++ ) {negative = m&1;
for( var n = 0; n < 100000; n++ )
	//negative?-Number( "1234" ):Number("1234");
	negative?-Number(val.string):Number(val.string);
}
console.log( "took:", Date.now() - start );


var start = Date.now();

for( var m = 0; m < 5000; m++ ) { negative = m&1;
for( var n = 0; n < 100000; n++ )
	Number(val.string) * (negative?-1:1);
	//Number("1234") * (negative?-1:1);
}
console.log( "took:", Date.now() - start );


var start = Date.now();

for( var m = 0; m < 5000; m++ ) { negative = m&1;
for( var n = 0; n < 100000; n++ )
	(negative?-1:1) * Number(val.string);
	//Number("1234") * (negative?-1:1);
}
console.log( "took:", Date.now() - start );
