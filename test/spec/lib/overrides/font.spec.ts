import sinonChai = require('../../../sinon-chai');
import blink = require('../../../../lib/blink');

var compiler = new blink.Compiler(blink.config);
var expect = sinonChai.expect;

// ReSharper disable WrongExpressionStatement
describe('font override', () => {

	it('accepts a string as the value', () => {
		var rule = new blink.Rule('foo', {
			font: 'bar'
		});
		expect(compiler.resolveRules([rule])).to.deep.equal([
			[['foo'], [
				['font', 'bar']
			]]
		]);
	});

	it('inserts shorthand declaration for all font properties', () => {
		var rule = new blink.Rule('foo', {
			font: {
				style: 'bar',
				variant: 'baz',
				weight: 'qux',
				size: 'quux',
				lineHeight: 'corge'
			}
		});
		expect(compiler.resolveRules([rule])).to.deep.equal([
			[['foo'], [
				['font', 'bar baz qux quux/corge']
			]]
		]);
	});

});
