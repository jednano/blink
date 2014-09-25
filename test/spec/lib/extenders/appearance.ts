import blink = require('../../../../lib/blink');
import sinonChai = require('../../../sinon-chai');

var appearance = blink.config.extenders.appearance;
var compiler = new blink.Compiler(blink.config);
var expect = sinonChai.expect;

// ReSharper disable WrongExpressionStatement
describe('appearance extender', () => {

	it('inserts appearance declaration', () => {
		var rule = new blink.Rule('foo', {
			extend: [appearance('bar')]
		});
		expect(compiler.resolveRules([rule])).to.deep.equal([
			[['foo'], [
				['-webkit-appearance', 'bar']
			]]
		]);
	});

});
