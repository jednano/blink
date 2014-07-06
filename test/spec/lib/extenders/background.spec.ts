import blink = require('../../../../lib/blink');
import sinonChai = require('../../../sinon-chai');

var background = blink.config.extenders.background;
var compiler = new blink.Compiler(blink.config);
var expect = sinonChai.expect;

// ReSharper disable WrongExpressionStatement
describe('background extender', () => {

	it('generates CSS font shorthand values in the correct order', () => {
		var rule = new blink.Rule('foo', {
			extend: [
				background({
					position: 'corge',
					repeat: 'qux',
					image: 'baz',
					color: 'bar',
					attachment: 'quux'
				})
			]
		});
		expect(compiler.resolveRules([rule])).to.deep.equal([
			[['foo'], [
				['background', 'bar baz qux quux corge']
			]]
		]);
	});

});
