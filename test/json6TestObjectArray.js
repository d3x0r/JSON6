'use strict';
var JSON6 = require('..');

describe('Objects and arrays', function () {
    it('Array of objects', function () {
        var d = '[ {a: "", b: ""}, {a: "", b: ""} ]';
        var result = JSON6.parse( d );
        console.log( result );
        expect(result).to.deep.equal([ {a: "", b: ""}, {a: "", b: ""} ]);
    });
    it('Array of objects and array', function () {
        var d = '[ {a: "", b: ""}, [1,2], {a: "", b: ""} ]';
        var result = JSON6.parse( d );
        console.log( result );
        expect(result).to.deep.equal([ {a: "", b: ""}, [1, 2], {a: "", b: ""} ]);
    });
    it('Object with child objects and arrays', function () {
        var d = '{ a:{a: "", b: ""}, b:[{d:"",e:""},{f:"",g:""}], c:{a: "", b: ""} }';
        var result = JSON6.parse( d );
        console.log( result );
        expect(result).to.deep.equal({
            a: {a: "", b: ""}, b: [{d:"",e:""}, {f:"",g:""}], c: {a: "", b: ""}
        });
    });
});
