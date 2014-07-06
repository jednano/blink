import sinonChai = require('../../../sinon-chai');
import blink = require('../../../../lib/blink');

var compiler = new blink.Compiler(blink.config);
var expect = sinonChai.expect;

// ReSharper disable WrongExpressionStatement
describe('background override', () => {

	it('inserts shorthand declaration for all background properties', () => {
		var rule = new blink.Rule('foo', {
			background: {
				position: 'corge',
				repeat: 'qux',
				image: 'baz',
				color: 'bar',
				attachment: 'quux'
			}
		});
		expect(compiler.resolveRules([rule])).to.deep.equal([
			[['foo'], [
				['background', 'bar baz qux quux corge']
			]]
		]);
	});

});
