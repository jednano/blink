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

	it('compiles overrides', () => {
		config.overrides.cap = (value: string) => {
			return [arguments, () => {
				return [['cap', value.toUpperCase()]];
			}];
		};
		var rules = [
			new Blink.Rule(['.foo'], {
				cap: 'qux',
				waldo: 'WALDO'
			}),
			new Blink.Rule(['.bar'], {
				cap: 'fred',
				thud: 'THUD'
			}),
			new Blink.Rule(['.baz'], {
				cap: 'qux',
				garpley: 'GARPLEY'
			})
		];
		expect(compiler.compileRules(rules)).to.eq([
			'.foo, .baz {',
			'  cap: QUX;',
			'}',
			'',
			'.bar {',
			'  cap: FRED;',
			'}',
			'',
			'.foo {',
			'  waldo: WALDO;',
			'}',
			'',
			'.bar {',
			'  thud: THUD;',
			'}',
			'',
			'.baz {',
			'  garpley: GARPLEY;',
			'}'
		].join(newline) + newline);
		delete config.overrides.cap;
	});

});
