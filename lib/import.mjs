// import.mjs
// Node.js only: adds a import() hook for .json6 files, just like the native
// hook for .json files.
//
// Usage:
// import {default as config} from "config.json6";


import fs from "fs";
import url from "url";
import path from "path";

/**
 * @param {string} url
 * @param {Object} context (currently empty)
 * @param {Function} defaultGetFormat
 * @returns {Promise<{ format: string }>}
 */
export async function getFormat(url, context, defaultGetFormat) {
	const exten = path.extname( url );
	//if( exten === '' ) return { format:'module' }
	if( exten === ".json6" ){
		return { format: 'module' };
	}
	return defaultGetFormat(url,context );
}

/**
 * @param {string} url
 * @param {{ format: string }} context
 * @param {Function} defaultGetSource
 * @returns {Promise<{ source: !(string | SharedArrayBuffer | Uint8Array) }>}
 */
export async function getSource(urlin, context, defaultGetSource) {
	const exten = path.extname( urlin );
	if( exten === ".json6" ){
		//const { format } = context;
		const file = url.fileURLToPath(urlin);
		return {
		        source: fs.readFileSync(file, 'utf8'),
		};
	}
	// Defer to Node.js for all other URLs.
	return defaultGetSource(urlin, context, defaultGetSource);
}

/**
 * @param {!(string | SharedArrayBuffer | Uint8Array)} source
 * @param {{
 *   format: string,
 *   url: string,
 * }} context
 * @param {Function} defaultTransformSource
 * @returns {Promise<{ source: !(string | SharedArrayBuffer | Uint8Array) }>}
 */
export async function transformSource(source, context, defaultTransformSource) {
	const exten = path.extname( context.url );
	if( exten === ".json6" ){
		return {
		      source: "const data = JSON6.parse( '" + escape(source) + "'); export default data;",
		};
	}
	return defaultTransformSource(source, context, defaultTransformSource);
}

function escape(string) {
	let output = '';
	if( !string ) return string;
	for( let n = 0; n < string.length; n++ ) {
		const ch = string[n];
		if( ch === '\n' ){
			output += "\\n";
		} else {
			if( ( ch === '"' ) || ( ch === '\\' ) || ( ch === '`' )|| ( ch === '\'' )) {
				output += '\\';
			}
			output += ch;
		}
	}
	return output;
}

/**
 * @returns {string} Code to run before application startup
 */
// Preloads JSON6 as a global resource; which is then used in the transformed source above.
export function getGlobalPreloadCode() {
	 return `\
const { createRequire } = getBuiltin('module');
const requireJSON6 = createRequire('${escape(url.fileURLToPath( import.meta.url ))}');
globalThis.JSON6 = requireJSON6( "../lib/index.js" );`;
}
