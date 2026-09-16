'use strict';
const { expect } = require( 'chai' );
const JSON6 = require( ".." );

// Built with fromCharCode so no editor or tool can silently turn an escape into the
// raw character (a raw LS/PS inside a regex literal is a syntax error).
const LS = String.fromCharCode( 0x2028 );
const PS = String.fromCharCode( 0x2029 );
const NBSP = String.fromCharCode( 0x00A0 );
const LINE_BREAK = new RegExp( '\r\n|\r|\n|' + LS + '|' + PS );

// Every error message ends in [line:col].  A stray '@' is the error in value position
// (JSON6 accepts it nowhere as a value) and a stray ']' is the error in key position
// ('@' would be a legal unquoted key); the expected position is computed from the
// source text, counting code points per column and CR, LF, CRLF, LS and PS as line breaks.
/** @param {string} src */
function position( src ) {
	const i = src.includes( '@' ) ? src.indexOf( '@' ) : src.indexOf( ']' );
	const lines = src.slice( 0, i ).split( LINE_BREAK );
	return `${lines.length}:${[ ...lines[lines.length - 1] ].length + 1}`;
}
/** @param {string} src */
function reported( src ) {
	try { JSON6.parse( src ); } catch( e ) {
		const message = /** @type {Error} */ ( e ).message;
		const m = /\[(\d+):(\d+)\]$/.exec( message );
		return m ? `${m[1]}:${m[2]}` : 'no position in: ' + message;
	}
	return 'no error';
}

describe('Error positions', function () {
	const cases = {
		'first character':                  '@',
		'plain':                            '[1, @]',
		'after a number':                   '[123 @]',
		'after a number with separators':   '[1_000_000 @]',
		'after a keyword':                  '[true, @]',
		'after a string':                   '["abc", @]',
		'after LF':                         '[\n@]',
		'after two LF':                     '[\n\n@]',
		'after CRLF':                       '[\r\n@]',
		'after CR alone':                   '[\r@]',
		'after LS':                         '[' + LS + '@]',
		'after PS':                         '[' + PS + '@]',
		'after a line comment':             '[ // c\n@]',
		'after two line comments':          '[ // a\n// b\n@]',
		'after a one-line block comment':   '[ /* c */ @]',
		'after a two-line block comment':   '[ /* c\n d */ @]',
		'after a three-line block comment': '[ /* c\n d\n e */ @]',
		'after a CRLF block comment':       '[ /* c\r\n d */ @]',
		'after a two-line string':          '["a\nb", @]',
		'after a three-line string':        '["a\nb\nc", @]',
		'after a two-line backtick string': '[`a\nb`, @]',
		'after a CRLF string':              '["a\r\nb", @]',
		'after a backslash-LF continuation': '["a\\\nb", @]',
		'after a backslash-CRLF continuation': '["a\\\r\nb", @]',
		'after a backslash-CR continuation': '["a\\\rb", @]',
		'inside an object after a comment': '{ a: 1, // x\n  b: ] }',
		'nested and indented':              '{\n  a: [\n    1,\n    @\n  ]\n}',
		'after a wide-character string':    '["新年", @]',
		'after an emoji key':               '{ "👍": 1, ] }',
		'in key position after a comment':  '{ a: 1, /* x\n y */ ] }',
		'after tabs':                       '[\t\t@]',
		'after NBSP':                       '[' + NBSP + '@]',
	};
	for( const [ name, src ] of Object.entries( cases ) ) {
		it( name, function () {
			expect( reported( src ) ).to.equal( position( src ) );
		} );
	}

	it( 'continues counting across streamed writes', function () {
		const parser = JSON6.begin( () => {} );
		parser.write( '[\n 1,\n' );
		let msg = '';
		try { parser.write( '  @' ); } catch( e ) { msg = /** @type {Error} */ ( e ).message; }
		expect( msg ).to.match( /\[3:3\]$/ );
	} );
} );
