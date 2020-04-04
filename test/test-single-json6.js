var JSON6 = require( ".." );

describe('Single JSON6', function () {
  it('Single JSON6', function () {
      var obj = JSON6.parse( "{ asdf : 1234 } " );
      console.log( "Got:", obj );
      expect(obj).to.deep.equal({
          asdf: 1234
      });
  });
});
