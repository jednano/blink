import blink = require('../../../../lib/browser/blink');
import sinonChai = require('../../../sinon-chai');

var config = blink.config;
var expect = sinonChai.expect;
var newline = config.newline;

function cap(val: string) {
	var fn = <blink.Extender>(() => {
		return [
			['cap', val.toUpperCase()]
		];
	});
	fn.args = arguments;
	return fn;
};

// ReSharper disable WrongExpressionStatement
describe('Compiler for browser', () => {

	var compiler: blink.Compiler;
	beforeEach(() => {
		compiler = new blink.Compiler(config);
	});

	it('compiles extenders', () => {
		var extender = <blink.Extender>(() => {
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
		compiler.compileRules(rules, (err, css) => {
			expect(css).to.eq([
				'.foo, .bar {',
				'  baz: BAZ;',
				'  qux: QUX;',
				'}'
			].join(newline) + newline);
		});
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
		compiler.compileRules(rules, (err, css) => {
			expect(css).to.eq([
				'.foo, .baz {',
				'  cap: QUUX;',
				'}',
				'.bar {',
				'  cap: CORGE;',
				'}'
			].join(newline) + newline);
		});
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
		compiler.compileRules(rules, (err, css) => {
			expect(css).to.eq([
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
		});
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
			compiler.compileRules([rule], (err, css) => {
				expect(css).to.eq([
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
			compiler.compileRules([rule], (err, css) => {
				expect(css).to.eq([
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
			compiler.compileRules(rules, (err, css) => {
				expect(css).to.eq([
					'@media baz {',
					'  .foo, .bar {',
					'    cap: QUX;',
					'  }',
					'}'
				].join(newline) + newline);
			});
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
			compiler.compileRules(rules, (err, css) => {
				expect(css).to.eq([
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
			compiler.compileRules(rules, (err, css) => {
				expect(css).to.eq([
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

});
