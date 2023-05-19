import js from '@eslint/js';
import globals from 'globals';

export default [
	js.configs.recommended,
	{
		ignores: [
			'dist'
		]
	},
	{
		languageOptions: {
			sourceType: 'commonjs',
			ecmaVersion : 'latest',
			globals: {
				console: 'readonly'
			}
		},
		rules: {
			indent: ['error', 'tab'],
			strict: ['error'],
			semi: ['error'],
			'prefer-const': ['error'],
			'no-var': ['error'],
			'no-mixed-spaces-and-tabs': ['error', 'smart-tabs']
		}
	},
	{
		files: ['lib/cli.js', 'build/**/*.js'],
		languageOptions: {
			sourceType: 'commonjs',
			ecmaVersion : 'latest',
			globals: {
				...globals.node
			}
		}
	},
	{
		files: ['test/**'],
		languageOptions: {
			ecmaVersion : 'latest',
			sourceType: 'commonjs',
			globals: {
				...globals.mocha,
				expect: 'readonly',
				console: 'readonly',
				// Add until converting to ESM
				__dirname: 'readonly'
			}
		}
	},
	{
		files: ['**/*.mjs'],
		languageOptions: {
			ecmaVersion : 'latest',
			sourceType: 'module'
		}
	}
];
