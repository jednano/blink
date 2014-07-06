import sinonChai = require('../../../sinon-chai');
var expect = sinonChai.expect;
import blink = require('../../../../lib/blink');

var compiler = new blink.Compiler(blink.config);

// ReSharper disable WrongExpressionStatement
describe('clearfix override', () => {

	it('inserts clearfix declarations when value is true', () => {
		var rule = new blink.Rule('foo', {
			clearfix: true
		});
		expect(compiler.resolveRules([rule])).to.deep.equal([
			[['foo:after'], [
				['content', ''],
				['display', 'table'],
				['clear', 'both']
			]]
		]);
	});

	it('inserts nothing when clearfix value is false', () => {
		var rule = new blink.Rule('foo', {
			clearfix: false
		});
		expect(compiler.resolveRules([rule])).to.deep.equal([]);
	});

});
