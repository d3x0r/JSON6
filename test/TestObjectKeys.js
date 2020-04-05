var JSON6 = require( ".." );

describe('Object keys', function () {
	describe('Erring', function () {
		it('Unencapsulated hyphenated key with space', function () {
		  	expect(function () {
				var result = JSON6.parse( "{ my- key:3}" );
				console.log( "result:", result );
		  	}).to.throw(Error);
		});

		it('Unencapsulated hyphenated key with spaces', function () {
		  	expect(function () {
				var result = JSON6.parse( "{ my -  key:3}" );
				console.log( "result:", result );
			}).to.throw(Error);
		});

		it('Unencapsulated hyphenated key with nested object', function () {
		  	expect(function () {
				var result = JSON6.parse( "{ my-key { failure:true}:3}" );
				console.log( "result:", result );
			}).to.throw(Error);
		});

		it('Unencapsulated key with nested object', function () {
		  	expect(function () {
				var result = JSON6.parse( "{ { my-key:3 } }" );
				console.log( "result:", result );
			}).to.throw(Error);
		});

		it('Unencapsulated key with nested array', function () {
		  	expect(function () {
				var result = JSON6.parse( "{ [ my-key:3 } }" );
				console.log( "result:", result );
			}).to.throw(Error);
		});

		it('Unencapsulated key with opening array bracket', function () {
		  	expect(function () {
				var result = JSON6.parse( "{ my-key[:3 } }" );
				console.log( "result:", result );
			}).to.throw(Error);
		});

		it('Unencapsulated key with closing array bracket', function () {
		  	expect(function () {
				var result = JSON6.parse( "{ my-key]:3 } }" );
				console.log( "result:", result );
			}).to.throw(Error);
		});

		it('Unencapsulated key with opening array bracket and space', function () {
		  	expect(function () {
				var result = JSON6.parse( "{ my-key [:3 } }" );
				console.log( "result:", result );
			}).to.throw(Error);
		});

		it('Unencapsulated key with closing array bracket and space', function () {
		  	expect(function () {
				var result = JSON6.parse( "{ my-key ]:3 } }" );
				console.log( "result:", result );
			}).to.throw(Error);
		});
	});

	describe('Functional', function () {
		it('Parses encapsulated key ', function () {
			var result = JSON6.parse( "{ 'my  -  key':3}" );
			console.log( "result:", result );
			expect(result).to.deep.equal({
				'my  -  key': 3
			});
		});

		it('Parses key with special characters but no spaces', function () {
			var result = JSON6.parse( "{ my-key\\m&m+*|:3}" );
			console.log( "result:", result );
			expect(result).to.deep.equal({
				'my-key\\m&m+*|' : 3
			});
		});

		it('Parses key with special characters and comment', function () {
			var result = JSON6.parse( "{ my-key //test \n :3}" );
			console.log( "result:", result );
			/*
			{ my-key //test
			   :3}   // valid
		   	*/
			expect(result).to.deep.equal({
				'my-key': 3
			});
		});

		it('Parses key with special characters and multi-line comment', function () {
			var result = JSON6.parse( "{ my-key /*test */ :3}" );
			console.log( "result:", result );

		   	/*
			{ my-key /*test * / :3}  // valid
			*/
		  	expect(result).to.deep.equal({
				'my-key': 3
			});
		});
	});
});
