import blink = require('../../../../lib/blink');
import sinonChai = require('../../../sinon-chai');

var compiler = new blink.Compiler(blink.config);
var expect = sinonChai.expect;
var font = blink.config.extenders.font;

// ReSharper disable WrongExpressionStatement
describe('font extender', () => {

	it('generates CSS font shorthand values in the correct order', () => {
		var rule = new blink.Rule('foo', {
			extend: [font({
				lineHeight: 'corge',
				size: 'quux',
				style: 'bar',
				weight: 'qux',
				variant: 'baz'
			})]
		});
		expect(compiler.resolveRules([rule])).to.deep.equal([
			[['foo'], [
				['font', 'bar baz qux quux/corge']
			]]
		]);
	});

	it('returns a line-height declaration if no size is specified', () => {
		var rule = new blink.Rule('foo', {
			extend: [font({ lineHeight: 'bar' })]
		});
		expect(compiler.resolveRules([rule])).to.deep.equal([
			[['foo'], [
				['line-height', 'bar']
			]]
		]);
	});

});
