import sinonChai = require('../../sinon-chai');
var expect = sinonChai.expect;
import Blink = require('../../../lib/Blink');


var config = Blink.config;
var newline = config.newline;

// ReSharper disable WrongExpressionStatement
describe('Compiler', () => {

	var compiler: Blink.Compiler;
	beforeEach(() => {
		compiler = new Blink.Compiler(config);
	});

	it('compiles extenders', () => {
		// ReSharper disable once JsFunctionCanBeConvertedToLambda
		function extender() {
			return () => {
				return [
					['foo', 'bar'],
					['baz', 'qux']
				];
			};
		};
		var rules = [
			new Blink.Rule(['.foo'], {
				extend: [ extender ]
			}),
			new Blink.Rule(['.bar'], {
				extend: [ extender ]
			})
		];
		expect(compiler.compileRules(rules)).to.eq([
			'.foo, .bar {',
			'  foo: bar;',
			'  baz: qux;',
			'}'
		].join(newline) + newline);
	});

});
