'use strict';
const { expect } = require( 'chai' );
const JSON6 = require('..');

describe('Objects and arrays', function () {
	it('Simple array with number', function () {
		const result = JSON6.parse( "[1234]" );
		expect(result).to.deep.equal([1234]);
	});
	it('Simple nested array with number', function () {
		const result = JSON6.parse( "[1,[2,[3,[4,5]]]]" );
		expect(result).to.deep.equal([1, [2, [3, [4, 5]]]]);
	});
	it('Array of objects', function () {
		const d = '[ {a: "", b: ""}, {a: "", b: ""} ]';
		const result = JSON6.parse( d );
		expect(result).to.deep.equal([ {a: "", b: ""}, {a: "", b: ""} ]);
	});
	it('Array with various types', function () {
		const d = '[true, false, -NaN, NaN, -Infinity, Infinity, null, undefined]';
		const result = JSON6.parse( d );
		expect(result).to.deep.equal([
			true, false, -NaN, NaN, -Infinity, Infinity, null, undefined
		]);
	});
	it('Sparse array', function () {
		const d = '[, ,]';
		const result = JSON6.parse( d );
		expect(result).to.deep.equal([
			undefined, undefined
		]);
	});
	it('Object with various types', function () {
		const d = '{a: true, b: false, c: -NaN, d: NaN, e: -Infinity, f: Infinity, g: undefined, h: null}';
		const result = JSON6.parse( d );
		expect(result).to.deep.equal({
			a: true, b: false, c: -NaN, d: NaN, e: -Infinity, f: Infinity, g: undefined, h: null
		});
	});
	it('Array with empty object', function () {
		const d = '[{}]';
		const result = JSON6.parse( d );
		expect(result).to.deep.equal([
			{}
		]);
	});
	it('Array of objects and array', function () {
		const d = '[ {a: "", b: ""}, [1,2], {a: "", b: ""} ]';
		const result = JSON6.parse( d );
		expect(result).to.deep.equal([ {a: "", b: ""}, [1, 2], {a: "", b: ""} ]);
	});
	it('Object with child objects and arrays', function () {
		const d = '{ a:{a: "", b: ""}, b:[{d:"",e:""},{f:"",g:""}], c:{a: "", b: ""} }';
		const result = JSON6.parse( d );
		expect(result).to.deep.equal({
			a: {a: "", b: ""}, b: [{d:"",e:""}, {f:"",g:""}], c: {a: "", b: ""}
		});
	});
});
