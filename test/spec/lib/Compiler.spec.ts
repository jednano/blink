import blink = require('../../../lib/blink');
import sinonChai = require('../../sinon-chai');

var config = blink.config;
var expect = sinonChai.expect;
var newline = config.newline;

function cap(val: string) {
	var fn = <blink.IExtender>(() => {
		return [
			['cap', val.toUpperCase()]
		];
	});
	fn.args = arguments;
	return fn;
};

// ReSharper disable WrongExpressionStatement
describe('Compiler', () => {

	var compiler: blink.Compiler;
	beforeEach(() => {
		compiler = new blink.Compiler(config);
	});

	it('compiles extenders', () => {
		var extender = <blink.IExtender>(() => {
			return [
				['baz', 'BAZ'],
				['qux', 'QUX']
			];
		});
		extender.args = arguments;
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
		var rules = [
			new blink.Rule(['.foo'], {
				extend: [ cap('quux') ]
			}),
			new blink.Rule(['.bar'], {
				extend: [ cap('corge') ]
			}),
			new blink.Rule(['.baz'], {
				extend: [ cap('quux') ]
			})
		];
		expect(compiler.compileRules(rules)).to.eq([
			'.foo, .baz {',
			'  cap: QUUX;',
			'}',
			'.bar {',
			'  cap: CORGE;',
			'}'
		].join(newline) + newline);
	});

	it('compiles overrides', () => {
		(<any>config.overrides).cap = cap;
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
			'.bar {',
			'  cap: FRED;',
			'}',
			'.foo {',
			'  waldo: WALDO;',
			'}',
			'.bar {',
			'  thud: THUD;',
			'}',
			'.baz {',
			'  garpley: GARPLEY;',
			'}'
		].join(newline) + newline);
		delete (<any>config.overrides).cap;
	});

	describe('responders', () => {

		it('compiles a basic responder', () => {
			var rule = new blink.Rule('.foo', {
				bar: 'BAR',
				respond: [
					new blink.MediaAtRule('baz', {
						qux: 'QUX'
					})
				]
			});
			expect(compiler.compileRules([rule])).to.eq([
				'.foo {',
				'  bar: BAR;',
				'}',
				'@media baz {',
				'  .foo {',
				'    qux: QUX;',
				'  }',
				'}'
			].join(newline) + newline);
		});

		it('compiles a nested responder', () => {
			var rule = new blink.Rule('.foo', {
				bar: 'BAR',
				respond: [
					new blink.MediaAtRule('baz', {
						qux: 'QUX',
						respond: [
							new blink.MediaAtRule('quux', {
								corge: 'CORGE'
							})
						]
					})
				]
			});
			expect(compiler.compileRules([rule])).to.eq([
				'.foo {',
				'  bar: BAR;',
				'}',
				'@media baz {',
				'  .foo {',
				'    qux: QUX;',
				'  }',
				'  @media quux {',
				'    .foo {',
				'      corge: CORGE;',
				'    }',
				'  }',
				'}'
			].join(newline) + newline);
		});

		it('properly extends inside of a responder', () => {
			var rules = [
				new blink.Rule('.foo', {
					respond: [
						new blink.MediaAtRule('baz', {
							extend: [cap('qux')]
						})
					]
				}),
				new blink.Rule('.bar', {
					respond: [
						new blink.MediaAtRule('baz', {
							extend: [cap('qux')]
						})
					]
				})
			];
			expect(compiler.compileRules(rules)).to.eq([
				'@media baz {',
				'  .foo, .bar {',
				'    cap: QUX;',
				'  }',
				'}'
			].join(newline) + newline);
		});

		it('merges responders with the same queries', () => {
			var rules = [
				new blink.Rule('.foo', {
					respond: [
						new blink.MediaAtRule('baz', {
							qux: 'QUX'
						})
					]
				}),
				new blink.Rule('.bar', {
					respond: [
						new blink.MediaAtRule('baz', {
							quux: 'QUUX'
						})
					]
				})
			];
			expect(compiler.compileRules(rules)).to.eq([
				'@media baz {',
				'  .foo {',
				'    qux: QUX;',
				'  }',
				'  .bar {',
				'    quux: QUUX;',
				'  }',
				'}'
			].join(newline) + newline);
		});

		it('merges nested responders with the same queries', () => {
			var rules = [
				new blink.Rule('.foo', {
					respond: [
						new blink.MediaAtRule('baz', {
							qux: 'QUX',
							respond: [
								new blink.MediaAtRule('corge', {
									grault: 'GRAULT'
								})
							]
						})
					]
				}),
				new blink.Rule('.bar', {
					respond: [
						new blink.MediaAtRule('baz', {
							quux: 'QUUX',
							respond: [
								new blink.MediaAtRule('corge', {
									garply: 'GARPLY'
								})
							]
						})
					]
				})
			];
			expect(compiler.compileRules(rules)).to.eq([
				'@media baz {',
				'  .foo {',
				'    qux: QUX;',
				'  }',
				'  @media corge {',
				'    .foo {',
				'      grault: GRAULT;',
				'    }',
				'    .bar {',
				'      garply: GARPLY;',
				'    }',
				'  }',
				'  .bar {',
				'    quux: QUUX;',
				'  }',
				'}'
			].join(newline) + newline);
		});

	});

});
