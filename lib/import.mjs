// import.mjs
// Node.js loader for .json6 files
// - Modern API: resolve/load hooks (Node 20+)
// - Generates an ES module that parses the JSON6 source and exports default

import fs from 'node:fs/promises';
import { fileURLToPath, URL } from 'node:url';

// Absolute path to this package's CommonJS entry used for parsing
const LIB_INDEX_ABS = fileURLToPath(new URL('./index.js', import.meta.url));

// Modern loader API
/** @type {import('node:module').ResolveHook} */
export async function resolve(specifier, context, nextResolve) {
	if (specifier.endsWith('.json6')) {
		const resolved = new URL(specifier, context.parentURL);
		return { url: resolved.href, shortCircuit: true, format: 'module' };
	}
	return nextResolve(specifier, context);
}

/** @type {import('node:module').LoadHook} */
export async function load(url, context, nextLoad) {
	if (url.endsWith('.json6')) {
		const file = fileURLToPath(url);
		const source = await fs.readFile(file, 'utf8');
		// Build module code that uses createRequire to access our CJS parser
		const code = `
import { createRequire } from 'node:module';
import path from 'node:path';
const require = createRequire(import.meta.url);
const JSON6 = require(${JSON.stringify(LIB_INDEX_ABS.replace(/\\/g, '/'))});
const data = JSON6.parse(${JSON.stringify(source)});
export default data;
`;
		return { format: 'module', source: code, shortCircuit: true };
	}
	return nextLoad(url, context);
}

