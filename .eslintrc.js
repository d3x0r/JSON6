'use strict';

module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es6: true,
        node: true
    },
    extends: 'eslint:recommended',
    overrides: [{
        files: 'test/**',
        globals: {
            expect: 'readonly'
        },
        env: {mocha: true}
    }],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly'
    },
    parserOptions: {
        ecmaVersion: 2018
    },
    rules: {
        indent: ['error', 4],
        strict: ['error'],
        semi: ['error']
    }
};
