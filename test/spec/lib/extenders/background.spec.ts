import sinonChai = require('../../../sinon-chai');
var expect = sinonChai.expect;
import background = require('../../../../lib/extenders/background');


// ReSharper disable WrongExpressionStatement
describe('background extender', () => {

	it('generates CSS font shorthand values in the correct order', () => {
		var decs = background({
			position: 'quux',
			repeat: 'baz',
			image: 'bar',
			color: 'foo',
			attachment: 'qux'
		})[1]();
		expect(decs).to.deep.equal([
			['background', ['foo', 'bar', 'baz', 'qux', 'quux']]
		]);
	});

});
