import sinonChai = require('../../sinon-chai');
var expect = sinonChai.expect;
import Blink = require('../../../lib/Blink');
import compilers = require('../../../lib/compilers');


var config = Blink.configuration;
var newline = config.newline;

// ReSharper disable WrongExpressionStatement
describe('compilers', () => {

	it('compiles extenders', () => {
		var extender = () => {
			return [
				['foo', 'bar'],
				['baz', 'qux']
			];
		};
		var rules = [
			new Blink.Rule(['.foo'], {
				extend: [ extender ]
			}),
			new Blink.Rule(['.bar'], {
				extend: [ extender ]
			})
		];
		var args = [config];
		args.push.apply(args, rules);
		expect(compilers.compileRules.apply(null, args)).to.eq([
			'.foo, .bar {',
			'  foo: bar;',
			'  baz: qux;',
			'}'
		].join(newline) + newline);
		expect(typeof Blink.Rule).to.eq('function');
	});

});
