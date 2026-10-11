"use strict";
// tsc emits `export = X` alongside `export type ...` in dist/json6.d.ts.  That
// combination is invalid in a declaration file (TS2309, "an export assignment
// cannot be used in a module with other exported elements") on TypeScript 5.x,
// so any consumer compiling without skipLibCheck fails.  Move the type exports
// into a namespace merged with the export assignment, and qualify references to
// those types in the const block.
//
// The type names are taken from the emitted `export type` lines, so a typedef
// added to src/json6.js is handled without touching this script.
const fs = require( "fs" );
const path = require( "path" );
const file = path.join( __dirname, "../dist/json6.d.ts" );
const src = fs.readFileSync( file, "utf8" );
const nl = src.includes( "\r\n" ) ? "\r\n" : "\n";

const exportMatch = /^export = (\w+);\r?\n/m.exec( src );
if( !exportMatch ) throw new Error( "export = not found in " + file + "; nothing to fix" );
const name = exportMatch[1];
const idx = exportMatch.index;
const marker = exportMatch[0];

const rest = src.slice( idx + marker.length );
const mapIdx = rest.indexOf( "//# sourceMappingURL" );
const typesText = mapIdx < 0 ? rest : rest.slice( 0, mapIdx );
const tail = mapIdx < 0 ? "" : rest.slice( mapIdx );

const typeNames = [ ...typesText.matchAll( /^export type (\w+)/gm ) ].map( m => m[1] );
if( typeNames.length === 0 ) throw new Error( "no `export type` lines found after export =; nothing to fix" );

const types = typesText
	.replace( /^export type /gm, "type " )
	.replace( /^(.)/gm, "    $1" );

// qualify bare references in the const block: not already qualified, not part of a longer identifier
const ref = new RegExp( "(?<![\\w.])(" + typeNames.join( "|" ) + ")\\b", "g" );
const head = src.slice( 0, idx ).replace( ref, name + ".$1" );

fs.writeFileSync( file, head + marker
	+ "declare namespace " + name + " {" + nl + types + "}" + nl + tail );
console.log( "fix-dts: moved " + typeNames.length + " type exports into namespace " + name );
