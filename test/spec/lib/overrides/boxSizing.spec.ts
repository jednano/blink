import sinonChai = require('../../../sinon-chai');
var expect = sinonChai.expect;
import blink = require('../../../../lib/blink');
import boxSizing = require('../../../../lib/overrides/boxSizing');


var config = blink.config;
var compiler = new blink.Compiler(config);

// ReSharper disable WrongExpressionStatement
describe('boxSizing override', () => {

	it('generates -moz and -webkit vendor prefixes for specified value', () => {
		var rule = new blink.Rule('foo', {
			boxSizing: 'border-box'
		});
		expect(compiler.resolveRules([rule])).to.deep.equal([
			[['foo'], boxSizing('border-box')(config)]
		]);
	});

});
