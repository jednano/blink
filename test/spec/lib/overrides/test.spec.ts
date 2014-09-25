import sinonChai = require('../../../sinon-chai');
import blink = require('../../../../lib/blink');

var compiler = new blink.Compiler(blink.config);
var expect = sinonChai.expect;

// ReSharper disable WrongExpressionStatement
describe('text override', () => {

	it('calls textSizeAdjust extender when   a string as the value', () => {
		var rule = new blink.Rule('foo', {
			font: 'bar'
		});
		expect(compiler.resolveRules([rule])).to.deep.equal([
			[['foo'], [
				['font', 'bar']
			]]
		]);
	});

});
