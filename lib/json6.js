// json6.js
// JSON for Humans. See README.md for details.
//
// This file is based off of https://github.com/d3x0r/sack  ./src/netlib/html5.websocket/json6_parser.c
// 

const _DEBUG_PARSING = false;
const _DEBUG_PARSING_STACK = false;

const VALUE_UNDEFINED = -1
const VALUE_UNSET = 0
const VALUE_NULL = 1
const VALUE_TRUE = 2
const VALUE_FALSE = 3
const VALUE_STRING = 4
const VALUE_NUMBER = 5
const VALUE_OBJECT = 6
const VALUE_ARRAY = 7
const VALUE_NEG_NAN = 8
const VALUE_NAN = 9
const VALUE_NEG_INFINITY = 10
const VALUE_INFINITY = 11
const VALUE_DATE = 12  // unused yet
const VALUE_EMPTY = 13 // [,] makes an array with 'empty item'

const WORD_POS_RESET = 0;
const WORD_POS_TRUE_1 = 1;
const WORD_POS_TRUE_2 = 2;
const WORD_POS_TRUE_3 = 3;
const WORD_POS_TRUE_4 = 4;
const WORD_POS_FALSE_1 = 5; 
const WORD_POS_FALSE_2 = 6;
const WORD_POS_FALSE_3 = 7;
const WORD_POS_FALSE_4 = 8;
const WORD_POS_NULL_1 = 9;
const WORD_POS_NULL_2 = 10;
const WORD_POS_NULL_3 = 11;
const WORD_POS_UNDEFINED_1 = 12;
const WORD_POS_UNDEFINED_2 = 13;
const WORD_POS_UNDEFINED_3 = 14;
const WORD_POS_UNDEFINED_4 = 15;
const WORD_POS_UNDEFINED_5 = 16;
const WORD_POS_UNDEFINED_6 = 17;
const WORD_POS_UNDEFINED_7 = 18;
const WORD_POS_UNDEFINED_8 = 19;
const WORD_POS_NAN_1 = 20;
const WORD_POS_NAN_2 = 21;
const WORD_POS_INFINITY_1 = 22;
const WORD_POS_INFINITY_2 = 23;
const WORD_POS_INFINITY_3 = 24;
const WORD_POS_INFINITY_4 = 25;
const WORD_POS_INFINITY_5 = 26;
const WORD_POS_INFINITY_6 = 27;
const WORD_POS_INFINITY_7 = 28;

const WORD_POS_FIELD = 29;
const WORD_POS_AFTER_FIELD = 30;
const WORD_POS_END = 31;

const CONTEXT_UNKNOWN = 0
const CONTEXT_IN_ARRAY = 1
const CONTEXT_IN_OBJECT = 2
const CONTEXT_OBJECT_FIELD = 3
const CONTEXT_OBJECT_FIELD_VALUE = 4

const contexts = [];
function getContext() { var ctx = contexts.pop(); if( !ctx ) ctx = { context : CONTEXT_UNKNOWN, elements : null, element_array : null }; return ctx; }
function dropContext(ctx) { contexts.push( ctx ) }

const buffers = [];
function getBuffer() { var buf = buffers.pop(); if( !buf ) buf = { buf:null, n:0 }; else buf.n = 0; return buf; }
function dropBuffer(buf) { buffers.push( buf ); }

var JSON6 = (typeof exports === 'object' ? exports : {});

JSON6.escape = function(string) {
	var n;
	var m = 0;
	var output = '';
	if( !string ) return string;
	for( n = 0; n < string.length; n++ ) {
		if( ( string[n] == '"' ) || ( string[n] == '\\' ) || ( string[n] == '`' )|| ( string[n] == '\'' )) {
			output += '\\';
		}
		output += string[n];
	}
	return output;
}



JSON6.begin = function( cb, reviver ) {

	let val = { name : null,	  // name of this value (if it's contained in an object)
		 	value_type: VALUE_UNSET, // value from above indiciating the type of this value
	 		string : '',   // the string value of this value (strings and number types only)
			contains : null,
		};
	
	let pos = { line:1, col:1 };
	let n = 0;

	let	mOut = 0,
		msg_length = 0,

		word = WORD_POS_RESET,
		status = true,
		negative = false,
		result = null,
		elements = undefined,
		element_array = [],
		context_stack = [],

		context = getContext(),
		parse_context = CONTEXT_UNKNOWN,
		comment = 0,
		fromHex = false,
		inQueue = [],
		gatheringStringFirstChar = null,
		gatheringString = false,
		gatheringNumber = false,
		completed = false
		;

	return {
		value() {
			var r = result;
			result = undefined;
			return r;
		},
		write(msg) {
			var retcode;
			for( retcode = this._write(msg,false); retcode > 0; retcode = this._write() ) {
				if( result ) {
					if( typeof reviver === 'function' ) (function walk(holder, key) {
						var k, v, value = holder[key];
						if (value && typeof value === 'object') {
							for (k in value) {
								if (Object.prototype.hasOwnProperty.call(value, k)) {
									v = walk(value, k);
									if (v !== undefined) {
										value[k] = v;
									} else {
										delete value[k];
									}
								}
							}
						}
						return reviver.call(holder, key, value);
					}({'': result}, ''));
					cb( result );
					result = undefined;
				}
				if( retcode < 2 )
					break;
			}
		},
		_write(msg,complete_at_end) {
			var c;
			var cInt;
			var input;
			var output;
			var retval = 0;

			function RESET_VAL()  {
				val.value_type = VALUE_UNSET;
				val.string = '';
			}

			function arrayPush() {
				switch( val.value_type ){
				case VALUE_NUMBER:
					element_array.push( new Number( val.string ) * (val.negative?-1:1) );
					break;
				case VALUE_STRING:
					element_array.push( val.string );
					break;
				case VALUE_NEG_NAN:
					element_array.push( -NaN );
					break;
				case VALUE_NAN:
					element_array.push( NaN );
					break;
				case VALUE_NEG_INFINITY:
					element_array.push( -Infinity );
					break;
				case VALUE_INFINITY:
					element_array.push( Infinity );
					break;
				case VALUE_NULL:
					element_array.push( null );
					break;
				case VALUE_UNDEFINED:
					element_array.push( undefined );
					break;
				case VALUE_EMPTY:
					element_array.push( undefined );
					delete element_array[element_array.length-1];
					break;
				}
			}
			function objectPush() {
				switch( val.value_type ){
				case VALUE_NUMBER:
					elements[val.name] = new Number( val.string ) * (val.negative?-1:1);
					break;
				case VALUE_STRING:
					elements[val.name] = ( val.string );
					break;
				case VALUE_NEG_NAN:
					elements[val.name] = ( -NaN );
					break;
				case VALUE_NAN:
					elements[val.name] = ( NaN );
					break;
				case VALUE_NEG_INFINITY:
					elements[val.name] = ( -Infinity );
					break;
				case VALUE_INFINITY:
					elements[val.name] = ( Infinity );
					break;
				case VALUE_NULL:
					elements[val.name] = ( null );
					break;
				case VALUE_UNDEFINED:
					elements[val.name] = ( undefined );
					break;
				}
			}

			function gatherString( c ) {
				var retval = 0;
				var start_c = c;
				var escape = false;
				var cr_escaped = false;
				while( ( ( input.n < input.buf.length ) && (c = input.buf.charAt(input.n++) ) ) && retval >= 0 )
				{
					let cInt = c.charCodeAt(0);
					pos.col++;
					if( cInt == 92/*'\\'*/ )
					{
						if( escape ) { val.string += '\\'; escape = false }
						else escape = true;
					}
					else if( ( cInt == 34/*'"'*/ ) || ( cInt == 39/*'\''*/ ) || ( cInt == 96/*'`'*/ ) )
					{
						if( escape ) { val.string += c; escape = false; }
						else if( cInt == start_c ) {
							retval = 1;
							break;
						} else val.string += c; // other else is not valid close quote; just store as content.
					}
					else
					{
						if( cr_escaped ) {
							cr_escaped = false;
							if( cInt == 10/*'\n'*/ ) {
								pos.line++;
								pos.col = 1;
								escape = false;
								continue;
							}
						}
						if( escape )
						{
							switch( cInt )
							{
							case 13/*'\r'*/:
								cr_escaped = true;
								continue;
							case 10/*'\n'*/:
								pos.line++;
								pos.col = 1;
								if( cr_escaped ) cr_escaped = false;
								// fall through to clear escape status <CR><LF> support.
							case 2028: // LS (Line separator)
							case 2029: // PS (paragraph separate)
								escape = false;
								continue;
							case 47/*'/'*/:
							case 92/*'\\'*/:
							case 34/*'"'*/:
								val.string += c;
								break;
							case 116/*'t'*/:
								val.string += '\t';
								break;
							case 98/*'b'*/:
								val.string += '\b';
								break;
							case 110/*'n'*/:
								val.string += '\n';
								break;
							case 114/*'r'*/:
								val.string += '\r';
								break;
							case 102/*'f'*/:
								val.string += '\f';
								break;
							case 48/*'0'*/: case 49/*'1'*/: case 50/*'2'*/: case 51/*'3'*/:
								{
									var oct_char = c.codePointAt(0) - 48;
									var ofs;
									for( ofs = 0; ofs < 2; ofs++ )
									{
										cInt = msg.charCodeAt(input.n++);
										oct_char *= 8;
										if( cInt >= 48/*'0'*/ && cInt <= 57/*'9'*/ )  oct_char += cInt/*.codePointAt(0)*/ - 0x30;
										else { input.n--; break; }
									}
									if( oct_char > 255 ) {
										console.log( ("(escaped character, parsing octal escape val=%d) fault while parsing; )") (" (near %*.*s[%c]%s)")
										                 , oct_char
												 , ( (n>3)?3:n ), ( (n>3)?3:n )
												 , msg.substr(input.n - ( (n>3)?3:n ), ( (n>3)?3:n ) )
												 , c
												 , msg.substr( input.n +1, 10 )
												 );// fault
										retval = -1;
										break;
									} else {
										val.string += String.fromCodePoint( oct_char );
									}
								}
								break;
							case 120/*'x'*/:
								{
									var hex_char;
									var ofs;
									hex_char = 0;
									for( ofs = 0; ofs < 2; ofs++ )
									{
										//c = msg.charAt(pos.n++);
										cInt = msg.charCodeAt(pos.n++);
										hex_char *= 16;
										if( cInt >= 48/*'0'*/ && cInt <= 57/*'9'*/ )      hex_char += cInt/*c.codePointAt(0)*/ - 0x30;
										else if( cInt >= 65/*'A'*/ && cInt <= 70/*'F'*/ ) hex_char += ( cInt/*c.codePointAt(0)*/ - 65 ) + 10;
										else if( cInt >= 97/*'a'*/ && cInt <= 102/*'f'*/ ) hex_char += ( cInt/*c.codePointAt(0)*/ - 96 ) + 10;
										else {
											console.log( ("(escaped character, parsing hex of \\x) fault while parsing; '%c' unexpected at %3 (near %*.*s[%c]%s)"), c, n
													 , ( (n>3)?3:n ), ( (n>3)?3:n )
												 , msg.substr( pos.n - ( (n>3)?3:n ), ( (n>3)?3:n ) )
												 , c
												 , msg.substr( pos.n +1, 10 )
													 );// fault
											retval = -1;
										}
									}
									val.string += String.fromCodePoint( mOut, hex_char );
								}
								break;
							case 117/*'u'*/:
								{
									var hex_char;
									var ofs;
									var codePointLen;
									var endCode;
									hex_char = 0;
									codePointLen = 4;
									endCode = 0;
									for( ofs = 0; ofs < codePointLen && ( c != endCode ); ofs++ )
									{
										cInt = msg.charCodeAt(pos.n++);
										if( !ofs && cInt == 123/*'{'*/ ) {
											codePointLen = 5; // collect up to 5 chars.
											endCode = '}';
											continue;
										}
										if( c == '}' ) continue;
										hex_char *= 16;
										if( cInt >= 48/*'0'*/ && cInt <= 57/*'9'*/ )      hex_char += cInt/*c.codePointAt(0)*/ - 0x30;
										else if( cInt >= 65/*'A'*/ && cInt <= 70/*'F'*/ ) hex_char += ( cInt/*c.codePointAt(0)*/ - 65 ) + 10;
										else if( cInt >= 97/*'a'*/ && cInt <= 102/*'f'*/ ) hex_char += ( cInt/*c.codePointAt(0)*/ - 96 ) + 10;
										else {
											throw new Error( ("(escaped character, parsing hex of \\u) fault while parsing; '%c' unexpected at %d (near %*.*s[%c]%s)"), c, n
													 , ( (n>3)?3:n ), ( (n>3)?3:n )
												 , msg.substr( pos.n - ( (n>3)?3:n ), ( (n>3)?3:n ) )
												 , c
												 , msg.substr( pos.n +1, 10 )
													 );// fault
													 retval = -1;
										}
									}
									val.string += String.fromCodePoint( mOut, hex_char );
								}
								break;
							default:
								if( cr_escaped ) {
									cr_escaped = false;
									escape = false;
									val.string += c;
								}
								else {
									throw new Error( ("(escaped character) fault while parsing; '%c' unexpected %d (near %*.*s[%c]%s)"), c, n
										 , ( (n>3)?3:n ), ( (n>3)?3:n )
												 , msg.substr( pos.n - ( (n>3)?3:n ), ( (n>3)?3:n ) )
												 , c
												 , msg.substr( pos.n +1, 10 )
										 );// fault
										 retval = -1;
								}
								break;
							}
							escape = 0;
						}
						else {
							val.string += c;
						}
					}
				}
				return retval;
			}
		

			function collectNumber() {
				let _n;
				while( (_n = input.n),(( input.n < input.buf.length ) && (c = input.buf.charAt(input.n++)) ) )
				{
					let cInt = c.codePointAt(0);
					if( cInt == 95 /*_*/ )
						continue;
					pos.col++;
					// leading zeros should be forbidden.
					if( ( cInt >= 48/*'0'*/ && cInt <= 57/*'9'*/ )
						|| ( cInt == 45/*'-'*/ )
						|| ( cInt == 43/*'+'*/ )
					  )
					{
						val.string += c;
					}
					else if( cInt == 120/*'x'*/ || cInt == 98/*'b'*/ || cInt == 111/*'o'*/ ) {
						// hex conversion.
						if( !fromHex && val.string == '0' ) {
							fromHex = true;
							val.string += c;
						}
						else {
							status = false;
							throw new Error( ("fault wile parsing; '%s' unexpected at %d  %d:%d"), c, input.n, pos.line, pos.col );
							break;
						}
					}
					else if( ( cInt == 101/*'e'*/ ) || ( cInt == 69/*'E'*/ ) || ( cInt == 46/*'.'*/ ) || ( cInt == 45/*-*/ ) )
					{
						val.string += c;
					}
					else
					{
						break;
					}
				}
				input.n = _n;
	                	
				if( (!complete_at_end) && input.n == input.buf.length )
				{
					gatheringNumber = true;
				}
				else
				{
					gatheringNumber = false;
					val.value_type = VALUE_NUMBER;
					if( parse_context == CONTEXT_UNKNOWN ) {
						completed = true;
					}
				}
			}

			if( !status )
				return -1;
	
			if( msg && msg.length ) {
				input = getBuffer();
				input.buf = msg;
				inQueue.push( input );
			} else {
				if( gatheringNumber ) {
					//console.log( "Force completed.")
					gatheringNumber = false;
					val.value_type = VALUE_NUMBER;
					if( parse_context == CONTEXT_UNKNOWN ) {
						completed = true;
					}
					retval = 1;  // if returning buffers, then obviously there's more in this one.
				}				
			}

			while( status && ( input = inQueue.shift() ) ) {
				n = input.n;
		                
				if( gatheringString ) {
					string_status = gatherString( gatheringStringFirstChar );
					if( string_status < 0 )
						status = false;
					else if( string_status > 0 )
					{
						gatheringString = false;
						if( status ) val.value_type = VALUE_STRING;
					}
				}
				if( gatheringNumber ) {
					collectNumber();
				}

				while( !completed && status && ( input.n < input.buf.length ) && ( c = input.buf.charAt(input.n++) ) )
				{
					cInt = c.charCodeAt(0);
					pos.col++;
					if( comment ) {
						if( comment == 1 ) {
							if( cInt == 42/*'*'*/ ) { comment = 3; continue; }
							if( cInt != 47/*'/'*/ ) {
								throw new Error( ("Fault while parsing; unexpected '%s' at %d  %d:%d"), c, input.n, pos.line, pos.col ); 
								status = false;
							}
							else comment = 2;
							continue;
						}
						if( comment == 2 ) {
							if( cInt == 10/*'\n'*/ ) { comment = 0; continue; }
							else continue;
						}
						if( comment == 3 ){
							if( cInt == 42/*'*'*/ ) { comment = 4; continue; }
							else continue;
						}
						if( comment == 4 ) {
							if( cInt == 47/*'/'*/ ) { comment = 0; continue; }
							else { if( cInt != 42/*'*'*/ ) comment = 3; continue; }
						}
					}
					switch( cInt )
					{
					case 47/*'/'*/:
						if( !comment ) comment = 1;
						break;
					case 123/*'{'*/:
						{
							var old_context = getContext();
							if( _DEBUG_PARSING )
							console.log( "Begin a new object; previously pushed into elements; but wait until trailing comma or close previously:%d", val.value_type );
			        
							val.value_type = VALUE_OBJECT;
							let tmpobj = {};
							if( parse_context == CONTEXT_UNKNOWN )
								result = elements = tmpobj;
							else if( parse_context == CONTEXT_IN_ARRAY )
								element_array.push( tmpobj );
							else if( parse_context == CONTEXT_OBJECT_FIELD_VALUE )
								elements[val.name] = tmpobj;
			        
							old_context.context = parse_context;
							old_context.elements = elements;
							old_context.element_array = element_array;
							elements = tmpobj;
							if( _DEBUG_PARSING_STACK ) console.log( "push context (open object): ", context_stack.length );
							context_stack.push( old_context );
							RESET_VAL();
							parse_context = CONTEXT_OBJECT_FIELD;
						}
						break;
			        
					case 91/*'['*/:
						if( parse_context == CONTEXT_OBJECT_FIELD ) {
							console.log( ("Fault while parsing; while getting field name unexpected '%s' at %d  %d:%"), c, input.n, pos.line, pos.col );
							status = false;
							break;
						}
						{
							var old_context = getContext();
							if( _DEBUG_PARSING )
							console.log( "Begin a new array; previously pushed into elements; but wait until trailing comma or close previously:%d", val.value_type );
			        
							val.value_type = VALUE_ARRAY;
							let tmparr = [];
							if( parse_context == CONTEXT_UNKNOWN )
								result = element_array = tmparr;
							else if( parse_context == CONTEXT_IN_ARRAY )
								element_array.push( tmparr );
							else if( parse_context == CONTEXT_OBJECT_FIELD_VALUE )
								elements[val.name] = tmparr;
			        
							old_context.context = parse_context;
							old_context.elements = elements;
							old_context.element_array = element_array;
							element_array = tmparr;
							if( _DEBUG_PARSING_STACK ) console.log( "push context (open array): ", context_stack.length );
							context_stack.push( old_context );
			        
							RESET_VAL();
							parse_context = CONTEXT_IN_ARRAY;
						}
						break;
			        
					case 58/*':'*/:
						if(_DEBUG_PARSING) console.log( "colon context:", parse_context );
						if( parse_context == CONTEXT_OBJECT_FIELD )
						{
							if( word != WORD_POS_RESET
								&& word != WORD_POS_FIELD
								&& word != WORD_POS_AFTER_FIELD ) {
								// allow starting a new word
								status = FALSE;
								throw new Error( `fault while parsing; unquoted keyword used as object field name at ${input.n-1} state:${word} (near ${input.buf.substr(input.n>4?(input.n-4):0,input.n>4?3:(input.n-1))}[${c}]${input.buf.substr(input.n, 10)}) [${pos.line}:${pos.col}]`)
								break;
							}
							word = WORD_POS_RESET;
							val.name = val.string;
							val.string = '';
							parse_context = CONTEXT_OBJECT_FIELD_VALUE;
							val.value_type = VALUE_UNSET;
						}
						else
						{
							if( parse_context == CONTEXT_IN_ARRAY )
								console.log( ("(in array, got colon out of string):parsing fault; unexpected '%s' at %d  %d:%d"), c, input.n, pos.line, pos.col );
							else
								console.log( ("(outside any object, got colon out of string):parsing fault; unexpected '%s' at %d  %d:%d"), c, input.n, pos.line, pos.col );
							status = false;
						}
						break;
					case 125/*'}'*/:
						if( word == WORD_POS_END ) {
							// allow starting a new word
							word = WORD_POS_RESET;
						}
						if(_DEBUG_PARSING) console.log( "close bracket context:", parse_context );
						// coming back after pushing an array or sub-object will reset the contxt to FIELD, so an end with a field should still push value.
						if( ( parse_context == CONTEXT_OBJECT_FIELD ) ) {
							if( _DEBUG_PARSING )
								console.log( "close object; empty object %d", val.value_type );
							RESET_VAL();
							var old_context = context_stack.pop();
							if( _DEBUG_PARSING_STACK ) console.log( "object pop stack (close obj)", context_stack.length );
							parse_context = old_context.context; // this will restore as IN_ARRAY or OBJECT_FIELD
							elements = old_context.elements;
							element_array = old_context.element_array;
							dropContext( old_context );
							if( parse_context == CONTEXT_UNKNOWN ) {
								completed = true;
							}
						}
						else if( ( parse_context == CONTEXT_OBJECT_FIELD_VALUE ) )
						{
							// first, add the last value
							if( _DEBUG_PARSING )
								console.log( "close object; push item '%s' %d", val.name, val.value_type );
							if( val.value_type != VALUE_UNSET ) {
								objectPush();
							}
							RESET_VAL();
			        
							var old_context = context_stack.pop();
							if( _DEBUG_PARSING_STACK ) console.log( "object pop stack (close object)", context_stack.length );
							parse_context = old_context.context; // this will restore as IN_ARRAY or OBJECT_FIELD
							elements = old_context.elements;
							element_array = old_context.element_array;
							dropContext( old_context );
							if( parse_context == CONTEXT_UNKNOWN ) {
								completed = true;
							}
						}
						else
						{
							throw new Error( ("Fault while parsing; unexpected '%s' at %d  %d:%d"), c, input.n, pos.line, pos.col );
							status = false;
						}
						negative = false;
						break;
					case 93/*']'*/:
						if( word == WORD_POS_END ) word = WORD_POS_RESET;
						if( parse_context == CONTEXT_IN_ARRAY )
						{
							if( _DEBUG_PARSING )
							console.log( "close array, push last element: %d", val.value_type );
							if( val.value_type != VALUE_UNSET ) {
								//val.string = mOut;
								arrayPush();
							}
							RESET_VAL();
							{
								var old_context = context_stack.pop();
								if( _DEBUG_PARSING_STACK ) console.log( "object pop stack (close array)", context_stack.length );
								parse_context = old_context.context;
								elements = old_context.elements;
								element_array = old_context.element_array;
								dropContext( old_context );
							}
							if( parse_context == CONTEXT_UNKNOWN ) {
								completed = true;
							}
						}
						else
						{
							throw new Error( ("bad context %d; fault while parsing; '%s' unexpected at %d  %d:%d") , parse_context, c, input.n, pos.line, pos.col );// fault
							status = false;
						}
						negative = false;
						break;
					case 44/*','*/:
						if( word == WORD_POS_END ) word = WORD_POS_RESET;  // allow collect new keyword
						if(_DEBUG_PARSING) console.log( "comma context:", parse_context );
						if( parse_context == CONTEXT_IN_ARRAY )
						{
							if( val.value_type == VALUE_UNSET )
								val.value_type = VALUE_EMPTY; // in an array, elements after a comma should init as undefined...

							if( val.value_type != VALUE_UNSET ) {
								if( _DEBUG_PARSING )
									console.log( "back in array; push item %d", val.value_type );
								arrayPush();
								RESET_VAL();
							}
							// undefined allows [,,,] to be 4 values and [1,2,3,] to be 4 values with an undefined at end.
						}
						else if( parse_context == CONTEXT_OBJECT_FIELD_VALUE )
						{
							// after an array value, it will have returned to OBJECT_FIELD anyway
							if( _DEBUG_PARSING )
								console.log( "comma after field value, push field to object: %s", val.name );
							parse_context = CONTEXT_OBJECT_FIELD;
							if( val.value_type != VALUE_UNSET ) {
								objectPush();
								RESET_VAL();
							}
						}
						else
						{
							status = false;
							throw new Error( ("bad context; fault while parsing; '%s' unexpected at %d  %d:%"), c, input.n, pos.line, pos.col );// fault
						}
						negative = false;
						break;
			        
					default:
						if( parse_context == CONTEXT_OBJECT_FIELD ) {
							switch( cInt )
							{
							case 96://'`':
							case 34://'"':
							case 39://'\'':
								string_status = gatherString(cInt );
								if(_DEBUG_PARSING) console.log( "string gather for object field name :", val.string );
								if( string_status ) {
									val.value_type = VALUE_STRING;
								} else {
									gatheringStringFirstChar = cInt;
									gatheringString = true;
								}
									
								break;
							case 10://'\n':
								pos.line++;
								pos.col = 1;
								// fall through to normal space handling - just updated line/col position
							case 13://'\r':
							case 32://' ':
							case 9://'\t':
							case 0xFEFF: // ZWNBS is WS though
								if( word == WORD_POS_END ) { // allow collect new keyword
									word = WORD_POS_RESET;
									if( parse_context == CONTEXT_UNKNOWN ) {
										completed = true;
									}
									break;
								}
								if( word == WORD_POS_RESET )
									break;
								else if( word == WORD_POS_FIELD ) {
									word = WORD_POS_AFTER_FIELD;
								}
								else {
									status = false;
									throw new Error( `fault while parsing; whitepsace unexpected at ${input.n-1} state:${word} (near ${input.buf.substr(input.n>4?(input.n-4):0,input.n>4?3:(input.n-1))}[${c}]${input.buf.substr(input.n, 10)}) [${pos.line}:${pos.col}]`)
								}
								// skip whitespace
								break;
							default:
								if( word == WORD_POS_RESET ) word = WORD_POS_FIELD;
								val.string += c;
								break; // default
							}
			        
						}
						else switch( cInt )
						{
						case 96://'`':
						case 34://'"':
						case 39://'\'':
							string_status = gatherString( cInt );
							if(_DEBUG_PARSING) console.log( "string gather for object field name :", val.string );
							if( string_status ) { 
								val.value_type = VALUE_STRING; 
								word = WORD_POS_END;
							} else {
									gatheringStringFirstChar = cInt;
									gatheringString = true;
							}
							break;
			        
						case 10://'\n':
							pos.line++;
							pos.col = 1;
						case 32://' ':
						case 9://'\t':
						case 13://'\r':
						case 0xFEFF://'\uFEFF':
							if( word == WORD_POS_END ) {
								word = WORD_POS_RESET;
								if( parse_context == CONTEXT_UNKNOWN ) {
									completed = true;
								}
								break;
							}
							if( word == WORD_POS_RESET )
								break;
							else if( word == WORD_POS_FIELD ) {
								word = WORD_POS_AFTER_FIELD;
							}
							else {
								status = false;
								throw new Error( `fault while parsing; whitepsace unexpected at ${input.n-1} (near ${input.buf.substr(input.n>4?(input.n-4):0,input.n>4?3:(input.n-1))}[${c}]${input.buf.substr(input.n, 10)}) [${pos.line}:${pos.col}]`)
							}
							break;
					//----------------------------------------------------------
					//  catch characters for true/false/null/undefined which are values outside of quotes
						case 116://'t':
							if( word == WORD_POS_RESET ) word = WORD_POS_TRUE_1;
							else if( word == WORD_POS_INFINITY_6 ) word = WORD_POS_INFINITY_7;
							else { status = false; throw new Error( ("fault while parsing; '%s' unexpected at %d  %d:%d"), c, input.n, pos.line, pos.col ); }// fault
							break;
						case 114://'r':
							if( word == WORD_POS_TRUE_1 ) word = WORD_POS_TRUE_2;
							else { status = false; throw new Error( ("fault while parsing; '%s' unexpected at %d  %d:%d"), c, input.n, pos.line, pos.col ); }// fault
							break;
						case 117://'u':
							if( word == WORD_POS_TRUE_2 ) word = WORD_POS_TRUE_3;
							else if( word == WORD_POS_NULL_1 ) word = WORD_POS_NULL_2;
							else if( word == WORD_POS_RESET ) word = WORD_POS_UNDEFINED_1;
							else { status = false; throw new Error( ("fault while parsing; '%s' unexpected at %d  %d:%d"), c, input.n, pos.line, pos.col ); }// fault
							break;
						case 101://'e':
							if( word == WORD_POS_TRUE_3 ) {
								val.value_type = VALUE_TRUE;
								word = WORD_POS_END;
							} else if( word == WORD_POS_FALSE_4 ) {
								val.value_type = VALUE_FALSE;
								word = WORD_POS_END;
							} else if( word == WORD_POS_UNDEFINED_3 ) word = WORD_POS_UNDEFINED_4;
							else if( word == WORD_POS_UNDEFINED_7 ) word = WORD_POS_UNDEFINED_8;
							else { status = false; throw new Error( ("fault while parsing; '%s' unexpected at %d  %d:%d"), c, input.n, pos.line, pos.col ); }// fault
							break;
						case 110://'n':
							if( word == WORD_POS_RESET ) word = WORD_POS_NULL_1;
							else if( word == WORD_POS_UNDEFINED_1 ) word = WORD_POS_UNDEFINED_2;
							else if( word == WORD_POS_UNDEFINED_6 ) word = WORD_POS_UNDEFINED_7;
							else if( word == WORD_POS_INFINITY_1 ) word = WORD_POS_INFINITY_2;
							else if( word == WORD_POS_INFINITY_4 ) word = WORD_POS_INFINITY_5;
							else { status = false; throw new Error( ("fault while parsing; '%s' unexpected at %d  %d:%d"), c, input.n, pos.line, pos.col ); }// fault
							break;
						case 100://'d':
							if( word == WORD_POS_UNDEFINED_2 ) word = WORD_POS_UNDEFINED_3;
							else if( word == WORD_POS_UNDEFINED_8 ) { val.value_type=VALUE_UNDEFINED; word = WORD_POS_END; }
							else { status = false; throw new Error( ("fault while parsing; '%s' unexpected at %d  %d:%d"), c, input.n, pos.line, pos.col ); }// fault
							break;
						case 105://'i':
							if( word == WORD_POS_UNDEFINED_5 ) word = WORD_POS_UNDEFINED_6;
							else if( word == WORD_POS_INFINITY_3 ) word = WORD_POS_INFINITY_4;
							else if( word == WORD_POS_INFINITY_5 ) word = WORD_POS_INFINITY_6;
							else { status = false; throw new Error( ("fault while parsing; '%s' unexpected at %d  %d:%d"), c, input.n, pos.line, pos.col ); }// fault
							break;
						case 108://'l':
							if( word == WORD_POS_NULL_2 ) word = WORD_POS_NULL_3;
							else if( word == WORD_POS_NULL_3 ) {
								val.value_type = VALUE_NULL;
								word = WORD_POS_END;
							} else if( word == WORD_POS_FALSE_2 ) word = WORD_POS_FALSE_3;
							else { status = false; throw new Error( ("fault while parsing; '%s' unexpected at %d  %d:%d"), c, input.n, pos.line, pos.col ); }// fault
							break;
						case 102://'f':
							if( word == WORD_POS_RESET ) word = WORD_POS_FALSE_1;
							else if( word == WORD_POS_UNDEFINED_4 ) word = WORD_POS_UNDEFINED_5;
							else if( word == WORD_POS_INFINITY_2 ) word = WORD_POS_INFINITY_3;
							else { status = false; throw new Error( ("fault while parsing; '%s' unexpected at %d  %d:%d"), c, input.n, pos.line, pos.col ); }// fault
							break;
						case 97://'a':
							if( word == WORD_POS_FALSE_1 ) word = WORD_POS_FALSE_2;
							else if( word == WORD_POS_NAN_1 ) word = WORD_POS_NAN_2;
							else { status = false; throw new Error( ("fault while parsing; '%s' unexpected at %d  %d:%d"), c, input.n, pos.line, pos.col ); }// fault
							break;
						case 115://'s':
							if( word == WORD_POS_FALSE_3 ) word = WORD_POS_FALSE_4;
							else { status = false; throw new Error( ("fault while parsing; '%s' unexpected at %d  %d:%d"), c, input.n, pos.line, pos.col ); }// fault
							break;
						case 73://'I':
							if( word == WORD_POS_RESET ) word = WORD_POS_INFINITY_1;
							else { status = false; throw new Error( ("fault while parsing; '%s' unexpected at %d  %d:%d"), c, input.n, pos.line, pos.col ); }// fault
							break;
						case 78://'N':
							if( word == WORD_POS_RESET ) word = WORD_POS_NAN_1;
							else if( word == WORD_POS_NAN_2 ) { val.value_type = negative ? VALUE_NEG_NAN : VALUE_NAN; word = WORD_POS_END; }
							else { status = false; throw new Error( ("fault while parsing; '%s' unexpected at %d  %d:%d"), c, input.n, pos.line, pos.col ); }// fault
							break;
						case 121://'y':
							if( word == WORD_POS_INFINITY_7 ) { val.value_type = negative ? VALUE_NEG_INFINITY : VALUE_INFINITY; word = WORD_POS_END; }
							else { status = false; throw new Error( `fault parsing '${c}' unexpected at ${input.n-1} (near ${input.buf.substr(input.n>4?(input.n-4):0,input.n>4?3:(input.n-1))}[${c}]${input.buf.substr(input.n, 10)}) [${pos.line}:${pos.col}]`) }// fault
							break;
					//
 	 	 	 	 	//----------------------------------------------------------
						case 45://'-':
							negative = !negative;
							break;
			        
						default:
							if( ( cInt >= 48/*'0'*/ && cInt <= 57/*'9'*/ ) || ( cInt == 43/*'+'*/ ) )
							{
								fromHex = false;
								val.string = c;
								collectNumber();
							}
							else
							{
								status = false;
								throw new Error( `fault parsing '${c}' unexpected at ${input.n-1} (near ${input.buf.substr(input.n>4?(input.n-4):0,input.n>4?3:(input.n-1))}[${c}]${input.buf.substr(input.n, 10)}) [${pos.line}:${pos.col}]`)
							}
							break; // default
						}
						break; // default of high level switch
					}
					if( completed ) {
						if( word == WORD_POS_END ) {
							word = WORD_POS_RESET;
						}
						break;
					}
				}
			        
				if( input.n == input.buf.length ) {
					dropBuffer( input );
					if( gatheringString || gatheringNumber || parse_context == CONTEXT_OBJECT_FIELD ) {
						retval = 0;
					}
					else {
						if( parse_context == CONTEXT_UNKNOWN && ( val.value_type != VALUE_UNSET || element_array.length != 0 ) ) {
							completed = true;
							retval = 1;
						}
					}
				}
				else {
					// put these back into the stack.
					inQueue.unshift( input );
					retval = 2;  // if returning buffers, then obviously there's more in this one.
				}
				if( completed )
					break;
			}

			if( !status ) return -1;
			if( completed && val.value_type != VALUE_UNSET ) {
				switch( val.value_type ) {
				case VALUE_NUMBER:
					result = Number( val.string );
					break;
				case VALUE_STRING:
					result = val.string;
					break;
				case VALUE_NULL:
					result = null;
					break;
				case VALUE_UNDEFINED:
					result = undefined;
					break;
				case VALUE_NAN:
					result = NaN;
					break;
				case VALUE_NEG_NAN:
					result = -NaN;
					break;
				case VALUE_INFINITY:
					result = Infinity;
					break;
				case VALUE_NEG_INFINITY:
					result = -Infinity;
					break;
				}
				val.string = '';
				val.value_type = VALUE_UNSET;
			}
			completed = false;
			return retval;
		}
	}
}



JSON6.parse = function( msg, reviver ) {
	var result = null;
	var parser = JSON6.begin();
	if( parser._write( msg, true ) > 0 )
	{
		var result = parser.value();
		return typeof reviver === 'function' ? (function walk(holder, key) {
			var k, v, value = holder[key];
			if (value && typeof value === 'object') {
				for (k in value) {
					if (Object.prototype.hasOwnProperty.call(value, k)) {
						v = walk(value, k);
						if (v !== undefined) {
							value[k] = v;
						} else {
							delete value[k];
						}
					}
				}
			}
			return reviver.call(holder, key, value);
		}({'': result}, '')) : result;
	}

	return result;
}
