'use strict';
var JSON6 = require('..');

describe('Objects and arrays', function () {
    it('Simple array with number', function () {
        JSON6.debug({parsingStack: true, parsing: true});
        var result = JSON6.parse( "[1234]" );
        expect(result).to.deep.equal([1234]);
        JSON6.debug({parsingStack: false, parsing: false});
    });
    it('Simple nested array with number', function () {
        JSON6.debug({parsing: true});
        var result = JSON6.parse( "[1,[2,[3,[4,5]]]]" );
        expect(result).to.deep.equal([1, [2, [3, [4, 5]]]]);
        JSON6.debug({parsing: false});
    });
    it('Array of objects', function () {
        JSON6.debug({parsing: true});
        var d = '[ {a: "", b: ""}, {a: "", b: ""} ]';
        var result = JSON6.parse( d );
        console.log( result );
        expect(result).to.deep.equal([ {a: "", b: ""}, {a: "", b: ""} ]);
        JSON6.debug({parsing: false});
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
