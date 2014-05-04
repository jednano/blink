import sinonChai = require('../../../sinon-chai');
var expect = sinonChai.expect;


var a = require('../../../../lib/helpers/array');

// ReSharper disable WrongExpressionStatement
describe('array helper', () => {

	it('flattens arrays', () => {
		expect(a.flatten([[1, 2], [[3, [4, 5]], [6], [], [7, [8]]]]))
			.to.deep.equal([1, 2, 3, 4, 5, 6, 7, 8]);
	});

});
