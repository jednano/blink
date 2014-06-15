import sinonChai = require('../../sinon-chai');
var expect = sinonChai.expect;
import blink = require('../../../lib/blink');


var config = blink.config;
var newline = config.newline;

// ReSharper disable WrongExpressionStatement
describe('Compiler', () => {

	var compiler: blink.Compiler;
	beforeEach(() => {
		compiler = new blink.Compiler(config);
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
			new blink.Rule(['.foo'], {
				extend: [ extender ]
			}),
			new blink.Rule(['.bar'], {
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
			new blink.Rule(['.foo'], {
				extend: [ extender('quux') ]
			}),
			new blink.Rule(['.bar'], {
				extend: [ extender('corge') ]
			}),
			new blink.Rule(['.baz'], {
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
			new blink.Rule(['.foo'], {
				cap: 'qux',
				waldo: 'WALDO'
			}),
			new blink.Rule(['.bar'], {
				cap: 'fred',
				thud: 'THUD'
			}),
			new blink.Rule(['.baz'], {
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
