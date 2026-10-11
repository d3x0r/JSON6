"use strict";
// tsc emits `export = X` alongside `export type ...`, which is invalid TS
// (TS2309). Move the type exports into a namespace merged with the export.
const fs = require( "fs" );
const path = require( "path" );
const file = path.join( __dirname, "../dist/json6.d.ts" );
const src = fs.readFileSync( file, "utf8" );
const marker = "export = JSON6_1;\n";
const idx = src.indexOf( marker );
if( idx < 0 ) throw new Error( "export = not found; nothing to fix" );
const rest = src.slice( idx + marker.length );
const mapIdx = rest.indexOf( "//# sourceMappingURL" );
const types = ( mapIdx < 0 ? rest : rest.slice( 0, mapIdx ) )
	.replace( /^export type /gm, "type " )
	.replace( /^(.)/gm, "    $1" );
const tail = mapIdx < 0 ? "" : rest.slice( mapIdx );
const head = src.slice( 0, idx ).replace(
	/(?<![\w.])(Json6(?:Reviver|ParseOptions|Stringifier|Replacer|StringifyOptions|Node)|NodeInfo|Context)\b/g,
	"JSON6_1.$1"
);
fs.writeFileSync( file, head + marker
	+ "declare namespace JSON6_1 {\n" + types + "}\n" + tail );
