// GENERATED FILE -- do not edit.
// Built from src/json6.js by build/src-to-lib.js (npm run build); edits here are overwritten.
// json6.js
// JSON for Humans. See README.md for details.
//
// This file is based off of https://github.com/d3x0r/sack  ./src/netlib/html5.websocket/json6_parser.c
//
"use strict";
const version = "1.1.5";
const VALUE_UNDEFINED = -1;
const VALUE_UNSET = 0;
const VALUE_NULL = 1;
const VALUE_TRUE = 2;
const VALUE_FALSE = 3;
const VALUE_STRING = 4;
const VALUE_NUMBER = 5;
const VALUE_OBJECT = 6;
const VALUE_ARRAY = 7;
const VALUE_NEG_NAN = 8;
const VALUE_NAN = 9;
const VALUE_NEG_INFINITY = 10;
const VALUE_INFINITY = 11;
// const VALUE_DATE = 12  // unused yet
const VALUE_EMPTY = 13; // [,] makes an array with 'empty item'

const WORD_POS_RESET = 0;
const WORD_POS_TRUE_1 = 1;
const WORD_POS_TRUE_2 = 2;
const WORD_POS_TRUE_3 = 3;
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

const CONTEXT_UNKNOWN = 0;
const CONTEXT_IN_ARRAY = 1;
// const CONTEXT_IN_OBJECT = 2
const CONTEXT_OBJECT_FIELD = 3;
const CONTEXT_OBJECT_FIELD_VALUE = 4;

/**
 * @typedef {{
 *   n: number,
 *   buf: null|string
 * }} Json6Node
 */

/**
 * @template T
 * @typedef {object} NodeInfo
 * @property {T} node
 * @property {NodeInfo<T>|null|undefined} next
 * @property {NodeInfo<T>|null} prior
 */

/**
 * @typedef {object} Context
 * @property {0|1|3|4} context
 * @property {Record<string, unknown>|null|undefined} elements
 * @property {unknown[]|null} element_array
 * @property {string|null} name
 */

/**
 * @type {Context[]}
 */
const contexts = [];
function getContext() {
	return /** @type {Context} */ (contexts.pop()) || /** @type {Context} */ ({
		context : CONTEXT_UNKNOWN,
		elements : null,
		element_array : null,
		name : null
	});
}

/**
 * @param {Context} ctx
 */
function dropContext(ctx) {
	contexts.push( ctx );
}

/** @type {Json6Node[]} */
const buffers = [];
function getBuffer() {
	/** @type {Json6Node|undefined} */
	let buf = buffers.pop();
	if( !buf ) buf = { buf:null, n:0 };
	else buf.n = 0;
	return /** @type {Json6Node} */ (buf);
}

/**
 * @param {Json6Node} buf
 */
function dropBuffer(buf) {
	buffers.push( buf );
}

/**
 * @template T
 * @param {T|undefined} value
 * @param {string} [msg]
 * @returns {T}
 */
function ensureDefined(value, msg) {
	/* istanbul ignore next -- every call site checks buf.length before consuming a code point, so codePointAt never actually returns undefined here */
	if( value === undefined ) throw new Error( msg || "Unexpected undefined value" );
	return value;
}

const JSON6 = {};

/*
let _DEBUG_LL = true;
let _DEBUG_PARSING = true;
let _DEBUG_PARSING_STACK = true;

const log = function(type) {
	if (type === '_DEBUG_PARSING' && !_DEBUG_PARSING) {
		return;
	}
	if (type === '_DEBUG_PARSING_STACK' && !_DEBUG_PARSING_STACK) {
		return;
	}
	if (type === '_DEBUG_LL' && !_DEBUG_LL) {
		return;
	}
	console.log.apply(console, [].slice.call(arguments, 1));
};
*/

/**
 * @param {string} string
 * @returns {string}
 */
JSON6.escape = function(string) {
	let output = '';
	if( !string ) return string;
	for( let n = 0; n < string.length; n++ ) {
		const ch = string[n];
		if( ( ch == '"' ) || ( ch == '\\' ) || ( ch == '`' )|| ( ch == '\'' )) {
			output += '\\';
		}
		output += ch;
	}
	return output;
};

/**
 * @callback Json6Reviver
 * @param {string} key
 * @param {unknown} value
 * @returns {unknown}
 */

/**
 * @param {(value: unknown) => void} [cb]
 * @param {Json6Reviver|undefined} [reviver]
 */
JSON6.begin = function( cb, reviver ) {

	const val = /** @type {{ name: string|null, value_type: number, string: string, contains: unknown }} */ ({ name : null,   // name of this value (if it's contained in an object)
		value_type: VALUE_UNSET, // value from above indiciating the type of this value
		string : '',   // the string value of this value (strings and number types only)
		contains : null,
	});
	const pos = /** @type {{ line: number, col: number }} */ ({ line:1, col:1 });
	/** @type {number} */ let n = 0;
	/** @type {number} */ let word = WORD_POS_RESET,
		status = true,
		negative = false,
		/** @type {unknown} */ result = null,
		/** @type {Record<string, unknown>|null|undefined} */ elements = undefined,
		/** @type {unknown[]|null} */ element_array = [],
		/** @type {0|1|3|4} */ parse_context = CONTEXT_UNKNOWN,
		comment = 0,
		fromHex = false,
		decimal = false,
		exponent = false,
		exponent_sign = false,
		exponent_digit = false,
		/** @type {number|null} */ gatheringStringFirstChar = null,
		gatheringString = false,
		gatheringNumber = false,
		signPending = false,  // '+' or '-' seen; no number or keyword has followed it yet
		stringEscape = false,
		cr_escaped = false,
		unicodeWide = false,
		stringUnicode = false,
		stringHex = false,
		hex_char = 0,
		hex_char_len = 0,
		completed = false;

	const context_stack = /** @type {{
		first: NodeInfo<Context>|null,
		last: NodeInfo<Context>|null,
		saved: NodeInfo<Context>|null|undefined,
		push: (node: Context) => void,
		pop: () => Context
	}} */ ({
			first : null,
			last : null,
			saved : null,
			/**
			 * @param {Context} node
			 */
			push(node) {
				/** @type {NodeInfo<Context>|null|undefined} */
				let recover = this.saved;
				if( recover ) { this.saved = recover.next; recover.node = node; recover.next = null; recover.prior = this.last; }
				else { recover = /** @type {NodeInfo<Context>} */ ({ node : node, next : null, prior : this.last }); }
				if( !this.last ) this.first = recover;
				this.last = recover;
			},
			pop() {
				const resultNode = this.last;
				/* istanbul ignore next -- pop() is only ever called from parse_context states that were entered via a matching push(), so the stack can never be empty here */
				if( !resultNode ) throw new Error( "context stack underflow" );
				if( !(this.last = resultNode.prior ) ) this.first = null;
				resultNode.next = this.saved; this.saved = resultNode;
				return resultNode.node;
			}
		});

	const inQueue = /** @type {{
		save: NodeInfo<Json6Node>|null|undefined,
		first: NodeInfo<Json6Node>|null|undefined,
		last: NodeInfo<Json6Node>|null,
		saved: NodeInfo<Json6Node>|null|undefined,
		push: (node: Json6Node) => void,
		shift: () => Json6Node|null,
		unshift: (node: Json6Node) => void
	}} */ ({
			/** @type {NodeInfo<Json6Node>|null|undefined} */
			save: undefined,
			/** @type {NodeInfo<Json6Node>|null|undefined} */
			first : null,
			/** @type {NodeInfo<Json6Node>|null} */
			last : null,
			/** @type {NodeInfo<Json6Node>|null|undefined} */
			saved : null,
			/**
			 * @param {Json6Node} node
			 */
			push(node) {
				/** @type {NodeInfo<Json6Node>|null|undefined} */
				let recover = this.saved;
				if( recover ) {this.saved = recover.next; recover.node = node; recover.next = null; recover.prior = this.last; }
				else { recover = /** @type {NodeInfo<Json6Node>} */ ({ node : node, next : null, prior : this.last }); }
				if( !this.last ) this.first = recover;
				else this.last.next = recover;
				this.last = recover;
			},
			shift() {
				const resultNode = this.first;
				if( !resultNode ) return null;
				this.first = resultNode.next;
				if( !this.first ) this.last = null;
				resultNode.next = this.saved;
				this.saved = resultNode;
				// node is in saved...
				return resultNode.node;
			},
			/**
			 * @param {Json6Node} node
			 */
			unshift(node) {
				// usage in this module, recover will ALWAYS have a saved to use.
				const recover = /** @type {NodeInfo<Json6Node>} */ (this.saved);
				this.saved = recover.next; recover.node = node; recover.next = this.first; recover.prior = null;
				if( !this.first ) this.last = recover;
				this.first = recover;
			}
		});

	/**
	 * @param {string} leader
	 */
	function throwEndError( leader /* , c */ ) {
		throw new Error( `${leader} at ${n} [${pos.line}:${pos.col}]`);
	}


	return {
		finalError() {
			if( comment !== 0 ) { // most of the time everything's good.
				switch (comment) {
				case 1:
					return throwEndError( "Comment began at end of document" );
				case 2:
					console.log( "Warning: '//' comment without end of line ended document" );
					break;
				case 3:
					return throwEndError( "Open comment '/*' is missing close at end of document" );
				case 4:
					return throwEndError( "Incomplete '/* *' close at end of document" );
				}
			}
			if( gatheringString ) throwEndError( "Incomplete string" );
		},
		value() {
			this.finalError();
			const r = result;
			result = undefined;
			return r;
		},
		reset() {
			word = WORD_POS_RESET;
			status = true;
			if( inQueue.last ) inQueue.last.next = inQueue.save;
			inQueue.save = inQueue.first;
			inQueue.first = inQueue.last = null;
			if( context_stack.last ) context_stack.last.next = context_stack.saved;
			context_stack.saved = inQueue.first;
			context_stack.first = context_stack.last = null;//= [];
			element_array = null;
			elements = undefined;
			parse_context = CONTEXT_UNKNOWN;
			val.value_type = VALUE_UNSET;
			val.name = null;
			val.string = '';
			pos.line = 1;
			pos.col = 1;
			negative = false;
			signPending = false;
			comment = 0;
			completed = false;
			gatheringStringFirstChar = null;
			gatheringString = false;
			stringEscape = false;  // string stringEscape intro
			cr_escaped = false;   // carraige return escaped
			unicodeWide = false;
			stringUnicode = false;
			stringHex = false;
			hex_char = 0;
			hex_char_len = 0;
			//stringUnicode = false;  // reading \u
			//unicodeWide = false;  // reading \u{} in string
			//stringHex = false;  // reading \x in string
		},
		/**
		 * @param {unknown} [msg]
		 */
		write(msg) {
			/** @type {number} */
			let retcode;
			// write() is the push interface; values only leave it through the callback.
			// parse() drives the same parser through _write()/value() and needs no callback.
			if( !cb ) throw new Error( "Callback function must be passed to begin, or you can't get values from the stream." );
			if( msg !== undefined && typeof msg !== "string") msg = String(msg);
			if( !status ) throw new Error( "Parser is in an error state, please reset." );
			for( retcode = this._write(/** @type {string|undefined|null} */ (msg),false); retcode > 0; retcode = this._write() ) {
				this.finalError();
				if( typeof reviver === 'function' ) (/**
					 * @param {Record<string, unknown>} holder
					 * @param {string} key
					 * @returns {unknown}
					 */
					function walk(holder, key) {
						const value = holder[key];
						if (value && typeof value === 'object') {
							const record = /** @type {Record<string, unknown>} */ (value);
							for (const k in record) {
								if (Object.prototype.hasOwnProperty.call(record, k)) {
									const v = walk(record, k);
									if (v !== undefined) {
										record[k] = v;
									} else {
										delete record[k];
									}
								}
							}
						}
						return reviver.call(holder, key, value);
					}({'': result}, ''));
				cb( result );
				result = undefined;

				if( retcode < 2 )
					break;
			}
			if( retcode )
				this.finalError();
		},
		/**
		 * @param {string|undefined|null} [msg]
		 * @param {boolean} [complete_at_end]
		 */
		_write(msg,complete_at_end) {
			/** @type {Json6Node|null} */
			let input;
			/** @type {string} */
			let buf = "";
			/** @type {number} */
			let retval = 0;

			/**
			 * @param {string} leader
			 * @param {number} c
			 */
			function throwError( leader, c ) {
				throw new Error( `${leader} '${String.fromCodePoint( c )}' unexpected at ${n} (near '${buf.substr(n>4?(n-4):0,n>4?3:(n-1))}[${String.fromCodePoint( c )}]${buf.substr(n, 10)}') [${pos.line}:${pos.col}]`);
			}

			function RESET_VAL()  {
				val.value_type = VALUE_UNSET;
				val.string = '';
				signPending = false;
			}

			// A delimiter, or the end of the document, arrived while a value was still
			// being spelled out: 'tru', 'nul', or a sign with nothing after it.  Without
			// this, '[tru]' was [] and 'tru' alone was undefined.
			/**
			 * @param {number} [cInt] the delimiter; omitted at end of document
			 */
			function checkPartialValue( cInt ) {
				if( word > WORD_POS_RESET && word < WORD_POS_FIELD ) {
					if( cInt === undefined ) throwEndError( "Incomplete keyword" );
					else throwError( "Incomplete keyword", cInt );
				}
				if( signPending && val.value_type == VALUE_UNSET ) {
					if( cInt === undefined ) throwEndError( "Sign with no number following" );
					else throwError( "Sign with no number following", cInt );
				}
			}

			// A new value is starting; there must not already be a finished one waiting
			// for a separator.  Without this, '[1 2]' kept only the 2.
			/**
			 * @param {number} cInt
			 */
			function checkValueSeparator( cInt ) {
				if( val.value_type != VALUE_UNSET )
					throwError( "Two values with no separator between them", cInt );
			}

			// collectNumber only admits digits, a sign, one '.', one 'e' and a radix
			// prefix, so a token Number() cannot read is malformed: '1e', '.5.', '.e3', '0x'.
			// These used to come back as NaN.
			function checkNumber() {
				if( Number.isNaN( Number( val.string ) ) ) {
					status = false;
					throw new Error( `Invalid number '${val.string}' at ${n} [${pos.line}:${pos.col}]` );
				}
			}

			function arrayPush() {
				// invariant: only called while parse_context is CONTEXT_IN_ARRAY, which is only
				// entered after '[' sets element_array to a real array.
				const arr = /** @type {unknown[]} */ (element_array);
				switch( val.value_type ){
				case VALUE_NUMBER:
					arr.push( (negative?-1:1) * Number( val.string ) );
					break;
				case VALUE_STRING:
					arr.push( val.string );
					break;
				case VALUE_TRUE:
					arr.push( true );
					break;
				case VALUE_FALSE:
					arr.push( false );
					break;
				case VALUE_NEG_NAN:
					arr.push( -NaN );
					break;
				case VALUE_NAN:
					arr.push( NaN );
					break;
				case VALUE_NEG_INFINITY:
					arr.push( -Infinity );
					break;
				case VALUE_INFINITY:
					arr.push( Infinity );
					break;
				case VALUE_NULL:
					arr.push( null );
					break;
				case VALUE_UNDEFINED:
					arr.push( undefined );
					break;
				case VALUE_EMPTY:
					arr.push( undefined );
					delete arr[arr.length-1];
					break;
				case VALUE_OBJECT:
					arr.push( val.contains );
					break;
				case VALUE_ARRAY:
					arr.push( val.contains );
					break;
				}
			}
			function objectPush() {
				// invariant: only called while parse_context is CONTEXT_OBJECT_FIELD_VALUE, which is
				// only entered after '{' sets elements to a real object.
				const obj = /** @type {Record<string, unknown>} */ (elements);
				const name = /** @type {string} */ (val.name);
				switch( val.value_type ){
				case VALUE_NUMBER:
					obj[name] = ((negative?-1:1) * Number( val.string ));
					break;
				case VALUE_STRING:
					obj[name] = ( val.string );
					break;
				case VALUE_TRUE:
					obj[name] = ( true );
					break;
				case VALUE_FALSE:
					obj[name] = ( false );
					break;
				case VALUE_NEG_NAN:
					obj[name] = ( -NaN );
					break;
				case VALUE_NAN:
					obj[name] = ( NaN );
					break;
				case VALUE_NEG_INFINITY:
					obj[name] = ( -Infinity );
					break;
				case VALUE_INFINITY:
					obj[name] = ( Infinity );
					break;
				case VALUE_NULL:
					obj[name] = ( null );
					break;
				case VALUE_UNDEFINED:
					obj[name] = ( undefined );
					break;
				case VALUE_OBJECT:
					obj[name] = val.contains;
					break;
				case VALUE_ARRAY:
					obj[name] = val.contains;
					break;
				}
			}

			/**
			 * @param {number} start_c
			 */
			function gatherString( start_c ) {
				let retval = 0;
				while( retval == 0 && ( n < buf.length ) ) {
					let str = buf.charAt(n);
					const cInt = ensureDefined( buf.codePointAt(n++), "Unexpected end of string" );
					if( cInt >= 0x10000 ) { str += buf.charAt(n); n++; }
					//console.log( "gathering....", stringEscape, str, cInt, unicodeWide, stringHex, stringUnicode, hex_char_len );
					pos.col++;
					if( cInt == start_c ) {//( cInt == 34/*'"'*/ ) || ( cInt == 39/*'\''*/ ) || ( cInt == 96/*'`'*/ ) )
						if( stringEscape ) {
							if( stringHex )
								throwError( "Incomplete hexidecimal sequence", cInt );
							else if( unicodeWide )
								throwError( "Incomplete long unicode sequence", cInt );
							else if( stringUnicode )
								throwError( "Incomplete unicode sequence", cInt );

							if( cr_escaped ) {
								cr_escaped = false; // \\ \r  '  :end string, the backslash was used for \r
								retval = 1;  // complete string.
							} else val.string += str; // escaped start quote
							stringEscape = false;
						}
						else {
							// quote matches, not escaped, and not processing escape...
							retval = 1;
						}
					}

					else if( stringEscape ) {
						if( unicodeWide ) {
							if( cInt == 125/*'}'*/ ) {
								val.string += String.fromCodePoint( hex_char );
								unicodeWide = false;
								stringUnicode = false;
								stringEscape = false;
								continue;
							}
							hex_char *= 16;
							if( cInt >= 48/*'0'*/ && cInt <= 57/*'9'*/ )      hex_char += cInt - 0x30;
							else if( cInt >= 65/*'A'*/ && cInt <= 70/*'F'*/ ) hex_char += ( cInt - 65 ) + 10;
							else if( cInt >= 97/*'a'*/ && cInt <= 102/*'f'*/ ) hex_char += ( cInt - 97 ) + 10;
							else {
								throwError( "(escaped character, parsing hex of \\u)", cInt );
							}
							continue;
						}
						else if( stringHex || stringUnicode ) {
							if( hex_char_len === 0 && cInt === 123/*'{'*/ ) {
								unicodeWide = true;
								continue;
							}
							hex_char *= 16;
							if( cInt >= 48/*'0'*/ && cInt <= 57/*'9'*/ )      hex_char += cInt - 0x30;
							else if( cInt >= 65/*'A'*/ && cInt <= 70/*'F'*/ ) hex_char += ( cInt - 65 ) + 10;
							else if( cInt >= 97/*'a'*/ && cInt <= 102/*'f'*/ ) hex_char += ( cInt - 97 ) + 10;
							else {
								throwError( stringUnicode?"(escaped character, parsing hex of \\u)":"(escaped character, parsing hex of \\x)", cInt );
							}
							hex_char_len++;
							if( stringUnicode ) {
								if( hex_char_len == 4 ) {
									val.string += String.fromCodePoint( hex_char );
									stringUnicode = false;
									stringEscape = false;
								}
							}
							else if( hex_char_len == 2 ) {
								val.string += String.fromCodePoint( hex_char );
								stringHex = false;
								stringEscape = false;
							}
							continue;
						}
						switch( cInt ) {
						case 13/*'\r'*/:
							cr_escaped = true;
							pos.col = 1;
							continue;
						case 0x2028: // LS (Line separator)
						case 0x2029: // PS (paragraph separator)
							pos.col = 1; // no return to get newline reset, so reset line pos.
							// Fallthrough
						case 10/*'\n'*/:
							if( cr_escaped ) {
								// \\ \r \n
								cr_escaped = false;
							} else {
								// \\ \n
								pos.col = 1;
							}
							pos.line++;
							break;
						case 116/*'t'*/:
							val.string += '\t';
							break;
						case 98/*'b'*/:
							val.string += '\b';
							break;
						case 48/*'0'*/:
							val.string += '\0';
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
						case 118/*'v'*/:
							val.string += '\v';
							break;
						case 120/*'x'*/:
							stringHex = true;
							hex_char_len = 0;
							hex_char = 0;
							continue;
						case 117/*'u'*/:
							stringUnicode = true;
							hex_char_len = 0;
							hex_char = 0;
							continue;
						default:
							val.string += str;
							break;
						}
						//console.log( "other..." );
						stringEscape = false;
					}
					else if( cInt === 92/*'\\'*/ ) {
						stringEscape = true;
					}
					else {
						if( cr_escaped ) {
							cr_escaped = false;
							// \\ \r <any other character>
							pos.line++;
							pos.col = 2; // newline, plus one character.
						}
						val.string += str;
					}
				}
				return retval;
			}


			function collectNumber() {
				let _n;
				while( (_n = n) < buf.length ) {
					const str = buf.charAt(_n);
					const cInt = ensureDefined( buf.codePointAt(n++), "Unexpected end of number" );
					if( cInt >= 0x10000 ) {
						throwError( "fault while parsing number;", cInt );
					}
					//log('_DEBUG_PARSING', "in getting number:", n, cInt, String.fromCodePoint(cInt) );
					if( cInt == 95 /*_*/ )
						continue;
					pos.col++;
					// leading zeros should be forbidden.
					if( cInt >= 48/*'0'*/ && cInt <= 57/*'9'*/ ) {
						if( exponent ) {
							exponent_digit = true;
						}
						val.string += str;
					} else if( cInt == 45/*'-'*/ || cInt == 43/*'+'*/ ) {
						if( val.string.length == 0 || ( exponent && !exponent_sign && !exponent_digit ) ) {
							val.string += str;
							exponent_sign = true;
						} else {
							status = false;
							throwError( "fault while parsing number;", cInt );
							// break;
						}
					} else if( cInt == 46/*'.'*/ ) {
						if( !decimal && !fromHex && !exponent ) {
							val.string += str;
							decimal = true;
						} else {
							status = false;
							throwError( "fault while parsing number;", cInt );
							// break;
						}
					} else if( fromHex && ( ( ( cInt >= 95/*'a'*/ ) && ( cInt <= 102/*'f'*/ ) ) ||
					           ( ( cInt >= 65/*'A'*/ ) && ( cInt <= 70/*'F'*/ ) ) ) ) {
						val.string += str;
					} else if( cInt == 120/*'x'*/ || cInt == 98/*'b'*/ || cInt == 111/*'o'*/
					         || cInt == 88/*'X'*/ || cInt == 66/*'B'*/ || cInt == 79/*'O'*/ ) {
						// hex conversion.
						if( !fromHex && val.string == '0' ) {
							fromHex = true;
							val.string += str;
						}
						else {
							status = false;
							throwError( "fault while parsing number;", cInt );
							// break;
						}
					} else if( ( cInt == 101/*'e'*/ ) || ( cInt == 69/*'E'*/ ) ) {
						if( !exponent ) {
							val.string += str;
							exponent = true;
						} else {
							status = false;
							throwError( "fault while parsing number;", cInt );
							// break;
						}
					} else {
						if( cInt == 32/*' '*/ || cInt == 160/* &nbsp */ || cInt == 13 || cInt == 10 || cInt == 9
					        || cInt == 0xFEFF || cInt == 44/*','*/ || cInt == 125/*'}'*/ || cInt == 93/*']'*/
					        || cInt == 58/*':'*/ ) {
							break;
						}
						else {
							if( complete_at_end ) {
								status = false;
								throwError( "fault while parsing number;", cInt );
							}
							break;
						}
					}
				}
				n = _n;

				if( (!complete_at_end) && n == buf.length ) {
					gatheringNumber = true;
				}
				else {
					gatheringNumber = false;
					checkNumber();
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
					checkNumber();
					val.value_type = VALUE_NUMBER;
					if( parse_context == CONTEXT_UNKNOWN ) {
						completed = true;
					} else {
						throw new Error( "context stack is not empty at flush" );
					}
					retval = 1;  // if returning buffers, then obviously there's more in this one.
				}
			}

			while( status && ( input = inQueue.shift() ) ) {
				n = input.n;
				// invariant: queued buffers are always given a string via `input.buf = msg` before being pushed.
				buf = /** @type {string} */ (input.buf);
				if( gatheringString ) {
					/* istanbul ignore next -- gatheringString and gatheringStringFirstChar are always set/cleared together; this guards state that the public API can never actually produce */
					if( gatheringStringFirstChar === null ) {
						throw new Error( "Parser string start was unset" );
					}
					const string_status = gatherString( gatheringStringFirstChar );
					if( string_status > 0 ) {
						gatheringString = false;
						val.value_type = VALUE_STRING;
					}
				}
				if( gatheringNumber ) {
					collectNumber();
				}

				while( !completed && status && ( n < buf.length ) ) {
					let str = buf.charAt(n);
					const cInt = ensureDefined( buf.codePointAt(n++), "Unexpected end of input while parsing" );
					if( cInt >= 0x10000 ) { str += buf.charAt(n); n++; }
					//// log('_DEBUG_PARSING', "parsing at ", cInt, str );
					//log('_DEBUG_LL', "processing: ", cInt, str, pos, comment, parse_context, word, val );
					pos.col++;
					if( comment ) { // '/'
						if( comment == 1 ) {  // '/'
							if( cInt == 42/*'*'*/ ) { comment = 3; }  // '/*'
							else if( cInt != 47/*'/'*/ ) {            // '//'(NOT)
								throwError( "fault while parsing;", cInt );
							}
							else comment = 2; // '//' (valid)
						}
						else if( comment == 2 ) { // '// ...'
							if( cInt == 10/*'\n'*/
							  || cInt == 13/*'\r'*/ ) comment = 0;
						}
						else if( comment == 3 ){ // '/*... '
							if( cInt == 42/*'*'*/ ) comment = 4;
						}
						else { // if( comment == 4 ) { // '/* ... *'
							if( cInt == 47/*'/'*/ ) comment = 0;
							else comment = 3; // any other char, goto expect * to close */
						}
						continue;
					}
					switch( cInt ) {
					case 47/*'/'*/:
						comment = 1;
						break;
					case 123/*'{'*/:
						if( word == WORD_POS_FIELD || word == WORD_POS_AFTER_FIELD || ( parse_context == CONTEXT_OBJECT_FIELD && word == WORD_POS_RESET ) ) {
							throwError( "fault while parsing; getting field name unexpected ", cInt );
							// break;
						}
						checkValueSeparator( cInt );
						{
							const old_context = getContext();
							//log('_DEBUG_PARSING', "Begin a new object; previously pushed into elements; but wait until trailing comma or close previously:%d", val.value_type );

							val.value_type = VALUE_OBJECT;
							const tmpobj = {};
							if( parse_context == CONTEXT_UNKNOWN )
								result = elements = tmpobj;

							old_context.context = parse_context;
							old_context.elements = elements;
							old_context.element_array = element_array;
							old_context.name = val.name;
							elements = tmpobj;
							//log('_DEBUG_PARSING_STACK',"push context (open object): ", context_stack.length );
							context_stack.push( old_context );
							RESET_VAL();
							parse_context = CONTEXT_OBJECT_FIELD;
						}
						break;

					case 91/*'['*/:
						if( parse_context == CONTEXT_OBJECT_FIELD || word == WORD_POS_FIELD || word == WORD_POS_AFTER_FIELD ) {
							throwError( "Fault while parsing; while getting field name unexpected", cInt );
							// break;
						}
						if( val.value_type == VALUE_UNSET || val.value_type == VALUE_UNDEFINED )
						{
							const old_context = getContext();
							//log('_DEBUG_PARSING', "Begin a new array; previously pushed into elements; but wait until trailing comma or close previously:%d", val.value_type );

							val.value_type = VALUE_ARRAY;
							/** @type {unknown[]} */
							const tmparr = [];
							if( parse_context == CONTEXT_UNKNOWN )
								result = element_array = tmparr;
							//else if( parse_context == CONTEXT_IN_ARRAY )
							//    element_array.push( tmparr );
							else if( parse_context == CONTEXT_OBJECT_FIELD_VALUE )
								// invariant: CONTEXT_OBJECT_FIELD_VALUE means elements/val.name were set by ':'.
								/** @type {Record<string, unknown>} */ (elements)[/** @type {string} */ (val.name)] = tmparr;

							old_context.context = parse_context;
							old_context.elements = elements;
							old_context.element_array = element_array;
							old_context.name = val.name;
							element_array = tmparr;
							//log('_DEBUG_PARSING_STACK', "push context (open array): ", context_stack.length );
							context_stack.push( old_context );

							RESET_VAL();
							parse_context = CONTEXT_IN_ARRAY;
						} else {
							throwError( "Unexpected array open after previous value", cInt );
						}
						break;

					case 58/*':'*/:
						////log('_DEBUG_PARSING', "colon context:", parse_context );
						if( parse_context == CONTEXT_OBJECT_FIELD ) {
							word = WORD_POS_RESET;
							val.name = val.string;
							val.string = '';
							parse_context = CONTEXT_OBJECT_FIELD_VALUE;
							val.value_type = VALUE_UNSET;
						}
						else {
							if( parse_context == CONTEXT_IN_ARRAY )
								throwError(  "(in array, got colon out of string):parsing fault;", cInt );
							else
								throwError( "(outside any object, got colon out of string):parsing fault;", cInt );
						}
						break;
					case 125/*'}'*/:
						////log('_DEBUG_PARSING', "close bracket context:", word, parse_context );
						if( word == WORD_POS_END ) {
							// allow starting a new word
							word = WORD_POS_RESET;
						}
						checkPartialValue( cInt );
						// coming back after pushing an array or sub-object will reset the context to FIELD, so an end with a field should still push value.
						if( ( parse_context == CONTEXT_OBJECT_FIELD ) ) {
							// a field name was collected but no ':' followed it: '{a}', '{a }', '{"a"}'.
							// This used to silently produce {}.
							if( word == WORD_POS_FIELD || word == WORD_POS_AFTER_FIELD || val.value_type == VALUE_STRING )
								throwError( "Object field name with no value", cInt );
							//log('_DEBUG_PARSING', "close object; empty object %d", val.value_type );
							//RESET_VAL();
							val.value_type = VALUE_OBJECT;
							val.contains = elements;

							const old_context = context_stack.pop();
							//log('_DEBUG_PARSING_STACK',"object pop stack (close obj)", context_stack.length, old_context );
							val.name = old_context.name;
							parse_context = old_context.context; // this will restore as IN_ARRAY or OBJECT_FIELD
							elements = old_context.elements;
							element_array = old_context.element_array;
							dropContext( old_context );
							if( parse_context == CONTEXT_UNKNOWN ) {
								completed = true;
							}
						}
						else if( ( parse_context == CONTEXT_OBJECT_FIELD_VALUE ) ) {
							// first, add the last value
							//log('_DEBUG_PARSING', "close object; push item '%s' %d", val.name, val.value_type );
							if( val.value_type != VALUE_UNSET ) {
								objectPush();
							} else {
								throwError( "Fault while parsing field value, close with no value", cInt );
							}
							val.value_type = VALUE_OBJECT;
							val.contains = elements;

							const old_context = context_stack.pop();
							//log('_DEBUG_PARSING_STACK',"object pop stack (close object)", context_stack.length, old_context );
							val.name = old_context.name;
							parse_context = old_context.context; // this will restore as IN_ARRAY or OBJECT_FIELD
							elements = old_context.elements;
							element_array = old_context.element_array;
							dropContext( old_context );
							if( parse_context == CONTEXT_UNKNOWN ) {
								completed = true;
							}
						}
						else {
							throwError( "Fault while parsing; unexpected", cInt );
						}
						negative = false;
						break;
					case 93/*']'*/:
						if( word == WORD_POS_END ) word = WORD_POS_RESET;
						checkPartialValue( cInt );
						if( parse_context == CONTEXT_IN_ARRAY ) {
							//log('_DEBUG_PARSING', "close array, push last element: %d", val.value_type );
							if( val.value_type != VALUE_UNSET ) {
								arrayPush();
							}
							val.value_type = VALUE_ARRAY;
							val.contains = element_array;
							{
								const old_context = context_stack.pop();
								//log('_DEBUG_PARSING_STACK',"object pop stack (close array)", context_stack.length );
								val.name = old_context.name;
								parse_context = old_context.context;
								elements = old_context.elements;
								element_array = old_context.element_array;
								dropContext( old_context );
							}
							if( parse_context == CONTEXT_UNKNOWN ) {
								completed = true;
							}
						}
						else {
							throwError( `bad context ${parse_context}; fault while parsing`, cInt );// fault
						}
						negative = false;
						break;
					case 44/*','*/:
						if( word == WORD_POS_END ) word = WORD_POS_RESET;  // allow collect new keyword
						checkPartialValue( cInt );
						//log('_DEBUG_PARSING', "comma context:", parse_context, val );
						if( parse_context == CONTEXT_IN_ARRAY ) {
							if( val.value_type == VALUE_UNSET )
								val.value_type = VALUE_EMPTY; // in an array, elements after a comma should init as undefined...

							//log('_DEBUG_PARSING', "back in array; push item %d", val.value_type );
							arrayPush();
							RESET_VAL();
							// undefined allows [,,,] to be 4 values and [1,2,3,] to be 4 values with an undefined at end.
						}
						else if( parse_context == CONTEXT_OBJECT_FIELD_VALUE ) {
							// after an array value, it will have returned to OBJECT_FIELD anyway
							//log('_DEBUG_PARSING', "comma after field value, push field to object: %s", val.name );
							parse_context = CONTEXT_OBJECT_FIELD;
							if( val.value_type != VALUE_UNSET ) {
								objectPush();
								RESET_VAL();
							}else
								throwError( "Unexpected comma after object field name", cInt );
						}
						else {
							status = false;
							throwError( "bad context; excessive commas while parsing;", cInt );// fault
						}
						negative = false;
						break;

					default:
						if( parse_context == CONTEXT_OBJECT_FIELD ) {
							switch( cInt ) {
							case 96://'`':
							case 34://'"':
							case 39://'\'':
								if( word == WORD_POS_RESET ) {
									if( val.value_type != VALUE_UNSET )
										throwError( "String begin after previous value", cInt );
									const string_status = gatherString(cInt );
									//log('_DEBUG_PARSING', "string gather for object field name :", val.string, string_status );
									if( string_status ) {
										val.value_type = VALUE_STRING;
									} else {
										gatheringStringFirstChar = cInt;
										gatheringString = true;
									}
								} else {
									throwError( "fault while parsing; quote not at start of field name", cInt );
								}

								break;
							case 10://'\n':
								pos.line++;
								pos.col = 1;
								// fall through to normal space handling - just updated line/col position
							case 13://'\r':
							case 32://' ':
							case 160://&nbsp:
							case 9://'\t':
							case 0xFEFF: // ZWNBS is WS though
								if( word == WORD_POS_END ) { // allow collect new keyword
									word = WORD_POS_RESET;
								}
								else if( word == WORD_POS_FIELD ) {
									word = WORD_POS_AFTER_FIELD;
								}
								// skip whitespace
								break;
							default:
								if( word == WORD_POS_AFTER_FIELD ) {
									status = false;
									throwError( "fault while parsing; character unexpected", cInt );
								}
								if( word == WORD_POS_RESET ) word = WORD_POS_FIELD;
								val.string += str;
								break; // default
							}
						}
						else switch( cInt ) {
						case 96://'`':
						case 34://'"':
						case 39: {//'\'':
							if( val.value_type === VALUE_UNSET ) {
								const string_status = gatherString( cInt );
								//log('_DEBUG_PARSING', "string gather for object field value :", val.string, string_status, completed, input.n, buf.length );
								if( string_status ) {
									val.value_type = VALUE_STRING;
									word = WORD_POS_END;
								} else {
									gatheringStringFirstChar = cInt;
									gatheringString = true;
								}
							}else throwError( "String unexpected", cInt );
							break;
						}
						case 10://'\n':
							pos.line++;
							pos.col = 1;
							// Fallthrough
						case 32://' ':
						case 160:// &nbsp
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
							if( word !== WORD_POS_RESET ) { // breaking in the middle of gathering a keyword.
								status = false;
								throwError( "fault parsing whitespace", cInt );
							}
							break;
							//----------------------------------------------------------
							//  catch characters for true/false/null/undefined which are values outside of quotes
						case 116://'t':
							if( word == WORD_POS_RESET ) { checkValueSeparator( cInt ); word = WORD_POS_TRUE_1; }
							else if( word == WORD_POS_INFINITY_6 ) word = WORD_POS_INFINITY_7;
							else { status = false; throwError( "fault parsing", cInt ); }// fault
							break;
						case 114://'r':
							if( word == WORD_POS_TRUE_1 ) word = WORD_POS_TRUE_2;
							else { status = false; throwError( "fault parsing", cInt ); }// fault
							break;
						case 117://'u':
							if( word == WORD_POS_TRUE_2 ) word = WORD_POS_TRUE_3;
							else if( word == WORD_POS_NULL_1 ) word = WORD_POS_NULL_2;
							else if( word == WORD_POS_RESET ) { checkValueSeparator( cInt ); word = WORD_POS_UNDEFINED_1; }
							else { status = false; throwError( "fault parsing", cInt ); }// fault
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
							else { status = false; throwError( "fault parsing", cInt ); }// fault
							break;
						case 110://'n':
							if( word == WORD_POS_RESET ) { checkValueSeparator( cInt ); word = WORD_POS_NULL_1; }
							else if( word == WORD_POS_UNDEFINED_1 ) word = WORD_POS_UNDEFINED_2;
							else if( word == WORD_POS_UNDEFINED_6 ) word = WORD_POS_UNDEFINED_7;
							else if( word == WORD_POS_INFINITY_1 ) word = WORD_POS_INFINITY_2;
							else if( word == WORD_POS_INFINITY_4 ) word = WORD_POS_INFINITY_5;
							else { status = false; throwError( "fault parsing", cInt ); }// fault
							break;
						case 100://'d':
							if( word == WORD_POS_UNDEFINED_2 ) word = WORD_POS_UNDEFINED_3;
							else if( word == WORD_POS_UNDEFINED_8 ) { val.value_type=VALUE_UNDEFINED; word = WORD_POS_END; }
							else { status = false; throwError( "fault parsing", cInt ); }// fault
							break;
						case 105://'i':
							if( word == WORD_POS_UNDEFINED_5 ) word = WORD_POS_UNDEFINED_6;
							else if( word == WORD_POS_INFINITY_3 ) word = WORD_POS_INFINITY_4;
							else if( word == WORD_POS_INFINITY_5 ) word = WORD_POS_INFINITY_6;
							else { status = false; throwError( "fault parsing", cInt ); }// fault
							break;
						case 108://'l':
							if( word == WORD_POS_NULL_2 ) word = WORD_POS_NULL_3;
							else if( word == WORD_POS_NULL_3 ) {
								val.value_type = VALUE_NULL;
								word = WORD_POS_END;
							} else if( word == WORD_POS_FALSE_2 ) word = WORD_POS_FALSE_3;
							else { status = false; throwError( "fault parsing", cInt ); }// fault
							break;
						case 102://'f':
							if( word == WORD_POS_RESET ) { checkValueSeparator( cInt ); word = WORD_POS_FALSE_1; }
							else if( word == WORD_POS_UNDEFINED_4 ) word = WORD_POS_UNDEFINED_5;
							else if( word == WORD_POS_INFINITY_2 ) word = WORD_POS_INFINITY_3;
							else { status = false; throwError( "fault parsing", cInt ); }// fault
							break;
						case 97://'a':
							if( word == WORD_POS_FALSE_1 ) word = WORD_POS_FALSE_2;
							else if( word == WORD_POS_NAN_1 ) word = WORD_POS_NAN_2;
							else { status = false; throwError( "fault parsing", cInt ); }// fault
							break;
						case 115://'s':
							if( word == WORD_POS_FALSE_3 ) word = WORD_POS_FALSE_4;
							else { status = false; throwError( "fault parsing", cInt ); }// fault
							break;
						case 73://'I':
							if( word == WORD_POS_RESET ) { checkValueSeparator( cInt ); word = WORD_POS_INFINITY_1; }
							else { status = false; throwError( "fault parsing", cInt ); }// fault
							break;
						case 78://'N':
							if( word == WORD_POS_RESET ) { checkValueSeparator( cInt ); word = WORD_POS_NAN_1; }
							else if( word == WORD_POS_NAN_2 ) { val.value_type = negative ? VALUE_NEG_NAN : VALUE_NAN; negative = false; word = WORD_POS_END; }
							else { status = false; throwError( "fault parsing", cInt ); }// fault
							break;
						case 121://'y':
							if( word == WORD_POS_INFINITY_7 ) { val.value_type = negative ? VALUE_NEG_INFINITY : VALUE_INFINITY; negative = false; word = WORD_POS_END; }
							else { status = false; throwError( "fault parsing", cInt ); }// fault
							break;
						case 45://'-':
							if( word == WORD_POS_RESET ) { checkValueSeparator( cInt ); signPending = true; negative = !negative; }
							else { status = false; throwError( "fault parsing", cInt ); }// fault
							break;
						case 43://'+':
							if( word !== WORD_POS_RESET ) { status = false; throwError( "fault parsing", cInt ); }// fault
							else { checkValueSeparator( cInt ); signPending = true; }
							break;
							//
							//----------------------------------------------------------
						default:
							if( ( cInt >= 48/*'0'*/ && cInt <= 57/*'9'*/ ) || ( cInt == 43/*'+'*/ ) || ( cInt == 46/*'.'*/ ) || ( cInt == 45/*'-'*/ ) ) {
								checkValueSeparator( cInt );
								fromHex = false;
								exponent = false;
								exponent_sign = false;
								exponent_digit = false;
								decimal = false;
								val.string = str;
								input.n = n;
								collectNumber();
							}
							else {
								status = false;
								throwError( "fault parsing", cInt );
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

				if( n == buf.length ) {
					dropBuffer( input );
					if( complete_at_end ) checkPartialValue();
					if( gatheringString || gatheringNumber || parse_context == CONTEXT_OBJECT_FIELD ) {
						retval = 0;
					}
					else {
						if( parse_context == CONTEXT_UNKNOWN && ( val.value_type != VALUE_UNSET || result ) ) {
							completed = true;
							retval = 1;
						}
					}
				}
				else {
					// put these back into the stack.
					input.n = n;
					inQueue.unshift( input );
					retval = 2;  // if returning buffers, then obviously there's more in this one.
				}
				if( completed )
					break;
			}

			if( completed && val.value_type != VALUE_UNSET ) {
				switch( val.value_type ) {
				case VALUE_NUMBER:
					result = ((negative?-1:1) * Number( val.string ));
					break;
				case VALUE_STRING:
					result = val.string;
					break;
				case VALUE_TRUE:
					result = true;
					break;
				case VALUE_FALSE:
					result = false;
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
				case VALUE_OBJECT: // never happens
					result = val.contains;
					break;
				case VALUE_ARRAY: // never happens
					result = val.contains;
					break;
				}
				negative = false;
				val.string = '';
				val.value_type = VALUE_UNSET;
			}
			completed = false;
			return retval;
		}
	};
};



const _parser = [Object.freeze( JSON6.begin() )];
let _parse_level = 0;

/**
 * @param {unknown} msg
 * @param {Json6Reviver} [reviver]
 */
JSON6.parse = function( msg, reviver ) {
	//var parser = JSON6.begin();
	const parse_level = _parse_level++;
	if( _parser.length <= parse_level )
		_parser.push( Object.freeze( JSON6.begin() ) );
	const parser = _parser[parse_level];
	if (typeof msg !== "string") msg = String(msg);
	parser.reset();
	try {
		if( parser._write( /** @type {string} */ (msg), true ) <= 0 ) {
			// nothing completed: empty document, whitespace, or only comments.
			parser.finalError();
			throw new Error( "No value found in document" );
		}
		const result = parser.value();
		if (typeof reviver === 'function') (/**
			 * @param {Record<string, unknown>} holder
			 * @param {string} key
			 * @returns {unknown}
			 */
			function walk(holder, key) {
				const value = holder[key];
				if (value && typeof value === 'object') {
					const record = /** @type {Record<string, unknown>} */ (value);
					for (const k in record) {
						if (Object.prototype.hasOwnProperty.call(record, k)) {
							const v = walk(record, k);
							if (v !== undefined) {
								record[k] = v;
							} else {
								delete record[k];
							}
						}
					}
				}
				return reviver.call(holder, key, value);
			}({'': result}, ''));
		return result;
	} finally {
		_parse_level--;
	}
};

//---------------------------------------------------------------------------
//  Stringify
//---------------------------------------------------------------------------

/**
 * @typedef {((key: string, value: unknown) => unknown) | Array<string|number> | null} Json6Replacer
 */

/**
 * @typedef {object} Json6Stringifier
 * @property {(o?: unknown, r?: Json6Replacer, s?: string|number|null, as?: string) => string|undefined} stringify
 * @property {(q: string) => void} setQuote
 * @property {boolean} ignoreNonEnumerable
 */

/** @type {Json6Stringifier|null} */
JSON6.stringifierActive = null;
JSON6.stringifier = function() {
	const keywords = {	["true"]:true,["false"]:false,["null"]:null,["NaN"]:NaN,["Infinity"]:Infinity,["undefined"]:undefined };
	let useQuote = '"';

	let ignoreNonEnumerable = false;

	return {
		/**
		 * @param {unknown} [o]
		 * @param {Json6Replacer} [r]
		 * @param {string|number|null} [s]
		 * @param {string} [as]
		 * @returns {string|undefined}
		 */
		stringify(o,r,s,as) { return stringify(this, o,r,s,as); },
		/**
		 * @param {string} q
		 */
		setQuote(q) { useQuote = q; },
		get ignoreNonEnumerable() { return ignoreNonEnumerable; },
		set ignoreNonEnumerable(val) { ignoreNonEnumerable = val; },
	};

	/**
	 * @param {string} s
	 */
	function getIdentifier(s) {
		if( !s.length ) return useQuote+useQuote;
		// should check also for if any non ident in string...
		return ( ( s in keywords /* [ "true","false","null","NaN","Infinity","undefined"].find( keyword=>keyword===s )*/
			|| /([0-9-])/.test(s[0])
			|| /((\n|\r|\t)|[ #{}()<>!+\-*/.:,])/.test( s ) )?(useQuote + JSON6.escape(s) +useQuote):s );
	}

	/**
	 * @param {Json6Stringifier} stringifier
	 * @param {unknown} object
	 * @param {Json6Replacer} [replacer]
	 * @param {string|number|null} [space]
	 * @param {string} [asField]
	 * @returns {string|undefined}
	 */
	function stringify( stringifier, object, replacer, space, asField ) {
		if( object === undefined ) return "undefined";
		if( object === null ) return "null";
		/** @type {string} */
		let gap = "";
		/** @type {string} */
		let indent = "";
		const stringifier_ = JSON6.stringifierActive;
		JSON6.stringifierActive = stringifier;

		if( !asField ) {
			asField = "";
		}


		// If the space parameter is a number, make an indent string containing that
		// many spaces.
		if (typeof space === "number") {
			for (let i = 0; i < space; i += 1) {
				indent += " ";
			}

		// If the space parameter is a string, it will be used as the indent string.
		} else if (typeof space === "string") {
			indent = space;
		}

		// If there is a replacer, it must be a function or an array.
		// Otherwise, throw an error.
		const rep = replacer;
		if( replacer && typeof replacer !== "function"
		    && ( typeof replacer !== "object"
		       || typeof replacer.length !== "number"
		   )) {
			throw new Error("JSON6.stringify unknown replacer type.");
		}

		const r  = str( asField, {[asField]:object} );
		JSON6.stringifierActive = stringifier_;
		//DEBUG_STRINGIFY_OUTPUT && console.trace( "Stringify Result:", r );
		return r;


		// from https://github.com/douglascrockford/JSON-js/blob/master/json2.js#L181
		/**
		 * @param {string} key
		 * @param {Record<string, unknown>} holder
		 * @returns {string|undefined}
		 */
		function str(key, holder) {
			// Produce a string from holder[key].
			const mind = gap;
			/** @type {unknown} */
			let value = holder[key];
			if( "string" === typeof value ) value = getIdentifier( value );

			if( value !== undefined
				&& value !== null
				&& typeof value === "object"
			    && typeof toJSOX === "function"
			) {
				// is encoding?
				gap += indent;
				gap = mind;
			}
			// If we were called with a replacer function, then call the replacer to
			// obtain a replacement value.

			if (typeof rep === "function") {
				value = rep.call(holder, key, value);
			}

			// What happens next depends on the value's type.
			switch (typeof value) {
			case "string":
				return value;
			case "number":
				return '' + value;//useQuote+JSOX.escape( value )+useQuote;
			case "boolean":
				return String(value);
			case "object": {

				//_DEBUG_STRINGIFY && console.log( "ENTERING OBJECT EMISSION WITH:", v );
				//if( v ) return v;

				// Due to a specification blunder in ECMAScript, typeof null is "object",
				// so watch out for that case.
				if (!value) {
					return "null";
				}
				const record = /** @type {Record<string, unknown>} */ (value);

				// Make an array to hold the partial results of stringifying this object value.

				gap += indent;
				/** @type {string[]} */
				const partial = [];

				// If the replacer is an array, use it to select the members to be stringified.
				if (rep && typeof rep === "object") {
					const length = rep.length;
					//_DEBUG_STRINGIFY && console.log( "Working through replacer" );
					for (let i = 0; i < length; i += 1) {
						if (typeof rep[i] === "string") {
							const k = /** @type {string} */ (rep[i]);
							const v = str(k, record);
							if (v) {
								partial.push(getIdentifier(k) + (
									(gap)
										? ": "
										: ":"
								) + v);
							}
						}
					}
				} else {

					// Otherwise, iterate through all of the keys in the object.
					/** @type {string[]} */
					const keys = [];
					//_DEBUG_STRINGIFY && console.log( "is something in something?", k, value );
					for (const k in record) {
						if( ignoreNonEnumerable )
							if( !Object.prototype.propertyIsEnumerable.call( record, k ) ){
								//_DEBUG_STRINGIFY && console.log( "skipping non-enuerable?", k );
								continue;
							}

						// sort properties into keys.
						if (Object.prototype.hasOwnProperty.call(record, k)) {
							let n;
							for( n = 0; n < keys.length; n++ )
								if( keys[n] > k ) {
									keys.splice(n,0,k );
									break;
								}
							if( n === keys.length )
								keys.push(k);
						}
					}
					//_DEBUG_STRINGIFY && console.log( "Expanding object keys:", v, keys );
					for(let n = 0; n < keys.length; n++) {
						const k = keys[n];
						if (Object.prototype.hasOwnProperty.call(record, k)) {
							const v = str(k, record);
							if (v) {
								partial.push(getIdentifier(k)+ (
									(gap)
										? ": "
										: ":"
								) + v);
							}
						}
					}
				}

				// Join all of the member texts together, separated with commas,
				// and wrap them in braces.
				//_DEBUG_STRINGIFY && console.log( "partial:", partial, protoConverter )
				const v = '' +
				        ( partial.length === 0
				        ? "{}"
				        : gap
				                ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}"
					        : "{" + partial.join(",") + "}"
				        );
				gap = mind;
				//_DEBUG_STRINGIFY && console.log(" Resulting phrase from this part is:", v );
				return v;
			}
			}
		}
	}
};

/**
 * @param {unknown} object
 * @param {Json6Replacer} [replacer]
 * @param {string|number} [space]
 * @returns {string|undefined}
 */
JSON6.stringify = function( object, replacer, space ) {
	const stringifier = JSON6.stringifier();
	return stringifier.stringify( object, replacer, space );
};

JSON6.version = version;

// CommonJS export; guarded so lib/json6.js can also be loaded directly with a
// <script> tag, where JSON6 is simply left as a global.
/* istanbul ignore next -- the non-CommonJS branch is only reachable from a browser <script> tag */
if( typeof module === "object" && module && module.exports ) module.exports = JSON6;
