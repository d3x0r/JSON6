var negative = true;
var val = { string : "1234", negative : false };

describe('Number conversions', function () {
    this.timeout(10000);
    it('Negative number', function () {
        var start = Date.now();
        for( var m = 0; m < 5000; m++ ) {
            val.negative = m & 1;
            for( var n = 0; n < 100000; n++ )
            //negative?-Number( "1234" ):Number("1234");
                val.negative ? -Number(val.string) : Number(val.string);
        }
        console.log( "took:", Date.now() - start );
    });
    it('Negative number (single negating expression)', function () {
        var start = Date.now();

        for( var m = 0; m < 5000; m++ ) {
            val.negative = m & 1;
            for( var n = 0; n < 100000; n++ )
                (val.negative ? -1 : 1) * Number(val.string);
            // Number("1234") * (negative?-1:1);
        }
        console.log( "took:", Date.now() - start );

    });
    it('Negative number (multiplying negative factor)', function () {
        var start = Date.now();

        for( var m = 0; m < 5000; m++ ) {
            val.negative = m & 1;
            for( var n = 0; n < 100000; n++ )
                Number(val.string) * (val.negative ? -1 : 1);
            // Number("1234") * (negative?-1:1);
        }
        console.log( "took:", Date.now() - start );

    });
    it('Negative number (changing variable)', function () {
        var start = Date.now();
        for( var m = 0; m < 5000; m++ ) {
            negative = m & 1;
            for( var n = 0; n < 100000; n++ )
            // negative ? -Number( "1234" ) : Number("1234");
                negative ? -Number(val.string) : Number(val.string);
        }
        console.log( "took:", Date.now() - start );

    });
    it('Negative number (changing variable and multiplying)', function () {
        var start = Date.now();

        for( var m = 0; m < 5000; m++ ) {
            negative = m & 1;
            for( var n = 0; n < 100000; n++ )
                Number(val.string) * (negative ? -1 : 1);
            // Number("1234") * (negative ? -1 : 1);
        }
        console.log( "took:", Date.now() - start );

    });
    it('Negative number (changing variable and multiplying in front)', function () {
        var start = Date.now();

        for( var m = 0; m < 5000; m++ ) {
            negative = m & 1;
            for( var n = 0; n < 100000; n++ )
                (negative ? -1 : 1) * Number(val.string);
            // Number("1234") * (negative ? -1 : 1);
        }
        console.log( "took:", Date.now() - start );

    });
});
