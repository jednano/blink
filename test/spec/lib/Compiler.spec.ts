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
			return [arguments, () => {
				return [
					['baz', 'BAZ'],
					['qux', 'QUX']
				];
			}];
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
			'  baz: BAZ;',
			'  qux: QUX;',
			'}'
		].join(newline) + newline);
	});

	it('compiles extenders with parameters', () => {
		// ReSharper disable once JsFunctionCanBeConvertedToLambda
		function extender(qux: string) {
			return [arguments, () => {
				return [
					['qux', qux]
				];
			}];
		};
		var rules = [
			new Blink.Rule(['.foo'], {
				extend: [ extender('quux') ]
			}),
			new Blink.Rule(['.bar'], {
				extend: [ extender('corge') ]
			}),
			new Blink.Rule(['.baz'], {
				extend: [ extender('quux') ]
			})
		];
		expect(compiler.compileRules(rules)).to.eq([
			'.foo, .baz {',
			'  qux: quux;',
			'}',
			'',
			'.bar {',
			'  qux: corge;',
			'}'
		].join(newline) + newline);
	});

});
