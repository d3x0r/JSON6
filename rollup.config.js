'use strict';
const nodeResolve = require('@rollup/plugin-node-resolve').default;
const commonjs = require('@rollup/plugin-commonjs').default;
const { babel } = require('@rollup/plugin-babel');
const strip = require('@rollup/plugin-strip').default;
const terser = require('@rollup/plugin-terser').default;
const pkg = require('./package.json');

module.exports = [
	// ES5 Non-minified
	{
		input: 'build/es5.js',
		output: {
			file: pkg.exports['.'].browser,
			format: 'umd',
			name: 'JSON5',
		},
		plugins: [
			strip({functions: ['log']}),
			nodeResolve(),
			commonjs(),
			babel({ babelHelpers: 'bundled' }),
		],
	},
	// ES5 Minified
	{
		input: 'build/es5.js',
		output: {
			file: pkg.exports['.'].browser.replace(/\.js$/, '.min.js'),
			format: 'umd',
			name: 'JSON5',
		},
		plugins: [
			strip({functions: ['log']}),
			nodeResolve(),
			commonjs(),
			babel({ babelHelpers: 'bundled' }),
			terser(),
		],
	},
	// ES6 Modules Non-minified
	{
		input: 'lib/index.js',
		output: {
			file: pkg.exports['.'].browser.replace(/\.js$/, '.mjs'),
			format: 'esm',
		},
		plugins: [
			strip({functions: ['log']}),
			nodeResolve(),
			commonjs(),
			babel({ babelHelpers: 'bundled' }),
		],
	},
	// ES6 Modules Minified
	{
		input: 'lib/index.js',
		output: {
			file: pkg.exports['.'].browser.replace(/\.js$/, '.min.mjs'),
			format: 'esm',
		},
		plugins: [
			strip({functions: ['log']}),
			nodeResolve(),
			commonjs(),
			terser(),
			babel({ babelHelpers: 'bundled' }),
		],
	},
];
