import sinonChai = require('../../../sinon-chai');
var expect = sinonChai.expect;
import blink = require('../../../../lib/blink');
import inlineBlock = require('../../../../lib/extenders/inlineBlock');


var config = blink.config;
var compiler = new blink.Compiler(config);

// ReSharper disable WrongExpressionStatement
describe('display override', () => {

	it('calls inlineBlock extender when value is inline-block', () => {
		var rule = new blink.Rule('foo', {
			display: 'inline-block'
		});
		expect(compiler.resolveRules([rule])).to.deep.equal([
			[['foo'], inlineBlock()(config)]
		]);
	});

	it('returns display: none when none is the value', () => {
		var rule = new blink.Rule('foo', {
			display: 'none'
		});
		expect(compiler.resolveRules([rule])).to.deep.equal([
			[['foo'], [
				['display', 'none']
			]]
		]);
	});

});
