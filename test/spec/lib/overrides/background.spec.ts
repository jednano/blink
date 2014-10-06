import sinonChai = require('../../../sinon-chai');
import blink = require('../../../../lib/blink');
import background = require('../../../../lib/overrides/background');

var expect = sinonChai.expect;
var config = new blink.Configuration();

// ReSharper disable WrongExpressionStatement
describe('background override', () => {

	it('inserts shorthand declaration for all background properties', () => {
		var result = background({
			position: 'corge',
			repeat: 'qux',
			image: 'baz',
			color: 'bar',
			attachment: 'quux'
		})(config);
		expect(result).to.deep.equal([
			['background', ['bar', 'baz', 'qux', 'quux', 'corge']]
		]);
	});

	it('generates no declarations when no options are provided', () => {
		var result = background({})(config);
		expect(result).to.deep.equal([]);
	});

});
