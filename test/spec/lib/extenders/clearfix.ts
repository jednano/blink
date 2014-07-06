import blink = require('../../../../lib/blink');
import sinonChai = require('../../../sinon-chai');

var clearfix = blink.config.extenders.clearfix;
var compiler = new blink.Compiler(blink.config);
var expect = sinonChai.expect;

// ReSharper disable WrongExpressionStatement
describe('clearfix extender', () => {

	it('inserts clearfix declarations inside :after pseudo-selector', () => {
		var rule = new blink.Rule('foo', {
			extend: [clearfix]
		});
		expect(compiler.resolveRules([rule])).to.deep.equal([
			[['foo:after'], [
				['content', ''],
				['display', 'table'],
				['clear', 'both']
			]]
		]);
	});

});
