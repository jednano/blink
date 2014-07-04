import sinonChai = require('../../../sinon-chai');
var expect = sinonChai.expect;
import font = require('../../../../lib/extenders/font');


// ReSharper disable WrongExpressionStatement
describe('font extender', () => {

	it('generates CSS font shorthand values in the correct order', () => {
		var decs = font({
			lineHeight: 'quux',
			size: 'qux',
			style: 'foo',
			weight: 'baz',
			variant: 'bar'
		})[1]();
		expect(decs).to.deep.equal([
			['font', ['foo', 'bar', 'baz', 'qux/quux']]
		]);
	});

	it('returns a line-height declaration if no size is specified', () => {
		var decs = font({
			lineHeight: 'foo'
		})[1]();
		expect(decs).to.deep.equal([
			['line-height', 'foo']
		]);
	});

});
