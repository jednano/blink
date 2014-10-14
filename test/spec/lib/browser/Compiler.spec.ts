import blink = require('../../../../lib/browser/blink');
import Compiler = require('../../../../lib/browser/Compiler');
import Configuration = require('../../../../lib/browser/Configuration');
import Extender = require('../../../../lib/interfaces/Extender');
import MediaAtRule = require('../../../../lib/MediaAtRule');
import Rule = require('../../../../lib/Rule');
import sinonChai = require('../../../sinon-chai');

var expect = sinonChai.expect;

// ReSharper disable WrongExpressionStatement
describe('Compiler for browser', () => {

	var compiler = new Compiler();
	var config = compiler.config;
	var newline = config.newline;

	it('compiles no rules into an empty string', done => {
		blink([], (err, css) => {
			expect(err).to.be.null;
			expect(css).to.be.empty;
			done();
		});
	});

	it('compiles an object literal as a Rule', done => {
		blink({ foo: { bar: 'baz' } }, (err, css) => {
			expect(err).to.be.null;
			expect(css).to.eq([
				'foo {',
				'  bar: baz;',
				'}'
			].join(newline) + newline);
			done();
		});
	});

	it('compiles numeric values of 0 as unitless', done => {
		blink({ foo: { bar: 0 } }, (err, css) => {
			expect(err).to.be.null;
			expect(css).to.eq([
				'foo {',
				'  bar: 0;',
				'}'
			].join(newline) + newline);
			done();
		});
	});

	it('compiles non-zero numeric values as px units', done => {
		blink({ foo: { bar: 42 } }, (err, css) => {
			expect(err).to.be.null;
			expect(css).to.eq([
				'foo {',
				'  bar: 42px;',
				'}'
			].join(newline) + newline);
			done();
		});
	});

	it('compiles multiple rules from an object literal', done => {
		var rules = {
			foo: {
				bar: 'baz'
			},
			waldo: {
				fred: 'thud'
			}
		};
		blink(rules, (err, css) => {
			expect(err).to.be.null;
			expect(css).to.eq([
				'foo {',
				'  bar: baz;',
				'}',
				'waldo {',
				'  fred: thud;',
				'}'
			].join(newline) + newline);
			done();
		});
	});

	it('compiles an instance of Rule', done => {
		var rule = new Rule('foo', { bar: 'baz' });
		compiler.compileRules([rule], (err, css) => {
			expect(err).to.be.null;
			expect(css).to.eq([
				'foo {',
				'  bar: baz;',
				'}'
			].join(newline) + newline);
			done();
		});
	});

	it('catches errors on compile', done => {
		var rule = new Rule('foo', { '': 'baz' });
		compiler.compileRules([rule], err => {
			expect(err).to.exist.and.to.have.property('message',
				'Invalid declaration property');
			done();
		});
	});

	it('compiles a basic rule in a string', done => {
		var contents = 'exports = new Rule("foo", { bar: "baz" });';
		blink(contents, (err, css) => {
			expect(err).to.be.null;
			expect(css).to.eq([
				'foo {',
				'  bar: baz;',
				'}'
			].join(config.newline) + config.newline);
			done();
		});
	});

	it('catches errors on string compilation', done => {
		var contents = 'exports = }';
		blink(contents, (err) => {
			expect(err).to.exist.and.to.have.property('message', 'Unexpected token }');
			done();
		});
	});

	it('compiles extenders', () => {
		var extender = <Extender>(() => {
			return [
				['baz', 'BAZ'],
				['qux', 'QUX']
			];
		});
		extender.args = arguments;
		var rules = [
			new Rule('foo', {
				extend: [ extender ]
			}),
			new Rule('bar', {
				extend: [ extender ]
			})
		];
		compiler.compileRules(rules, (err, css) => {
			expect(err).to.be.null;
			expect(css).to.eq([
				'foo, bar {',
				'  baz: BAZ;',
				'  qux: QUX;',
				'}'
			].join(newline) + newline);
		});
	});

	it('compiles extenders with parameters', () => {
		var rules = [
			new Rule('foo', {
				extend: [ cap('quux') ]
			}),
			new Rule('bar', {
				extend: [ cap('corge') ]
			}),
			new Rule('baz', {
				extend: [ cap('quux') ]
			})
		];
		compiler.compileRules(rules, (err, css) => {
			expect(err).to.be.null;
			expect(css).to.eq([
				'foo, baz {',
				'  cap: QUUX;',
				'}',
				'bar {',
				'  cap: CORGE;',
				'}'
			].join(newline) + newline);
		});
	});

	it('compiles overrides', () => {
		(<any>config.overrides).cap = cap;
		var rules = [
			new Rule('foo', {
				cap: 'qux',
				waldo: 'WALDO'
			}),
			new Rule('bar', {
				cap: 'fred',
				thud: 'THUD'
			}),
			new Rule('baz', {
				cap: 'qux',
				garpley: 'GARPLEY'
			})
		];
		compiler.compileRules(rules, (err, css) => {
			expect(err).to.be.null;
			expect(css).to.eq([
				'foo, baz {',
				'  cap: QUX;',
				'}',
				'bar {',
				'  cap: FRED;',
				'}',
				'foo {',
				'  waldo: WALDO;',
				'}',
				'bar {',
				'  thud: THUD;',
				'}',
				'baz {',
				'  garpley: GARPLEY;',
				'}'
			].join(newline) + newline);
		});
		delete (<any>config.overrides).cap;
	});

	describe('responders', () => {

		it('compiles a basic responder', () => {
			var rule = new Rule('foo', {
				bar: 'BAR',
				respond: [
					new MediaAtRule('baz', {
						qux: 'QUX'
					})
				]
			});
			compiler.compileRules([rule], (err, css) => {
				expect(err).to.be.null;
				expect(css).to.eq([
					'foo {',
					'  bar: BAR;',
					'}',
					'@media baz {',
					'  foo {',
					'    qux: QUX;',
					'  }',
					'}'
				].join(newline) + newline);
			});
		});

		it('compiles a nested responder', () => {
			var rule = new Rule('foo', {
				bar: 'BAR',
				respond: [
					new MediaAtRule('baz', {
						qux: 'QUX',
						respond: [
							new MediaAtRule('quux', {
								corge: 'CORGE'
							})
						]
					})
				]
			});
			compiler.compileRules([rule], (err, css) => {
				expect(err).to.be.null;
				expect(css).to.eq([
					'foo {',
					'  bar: BAR;',
					'}',
					'@media baz {',
					'  foo {',
					'    qux: QUX;',
					'  }',
					'  @media quux {',
					'    foo {',
					'      corge: CORGE;',
					'    }',
					'  }',
					'}'
				].join(newline) + newline);
			});
		});

		it('properly extends inside of a responder', () => {
			var rules = [
				new Rule('foo', {
					respond: [
						new MediaAtRule('baz', {
							extend: [cap('qux')]
						})
					]
				}),
				new Rule('bar', {
					respond: [
						new MediaAtRule('baz', {
							extend: [cap('qux')]
						})
					]
				})
			];
			compiler.compileRules(rules, (err, css) => {
				expect(err).to.be.null;
				expect(css).to.eq([
					'@media baz {',
					'  foo, bar {',
					'    cap: QUX;',
					'  }',
					'}'
				].join(newline) + newline);
			});
		});

		it('merges responders with the same queries', () => {
			var rules = [
				new Rule('foo', {
					respond: [
						new MediaAtRule('baz', {
							qux: 'QUX'
						})
					]
				}),
				new Rule('bar', {
					respond: [
						new MediaAtRule('baz', {
							quux: 'QUUX'
						})
					]
				})
			];
			compiler.compileRules(rules, (err, css) => {
				expect(err).to.be.null;
				expect(css).to.eq([
					'@media baz {',
					'  foo {',
					'    qux: QUX;',
					'  }',
					'  bar {',
					'    quux: QUUX;',
					'  }',
					'}'
				].join(newline) + newline);
			});
		});

		it('merges nested responders with the same queries', () => {
			var rules = [
				new Rule('foo', {
					respond: [
						new MediaAtRule('baz', {
							qux: 'QUX',
							respond: [
								new MediaAtRule('corge', {
									grault: 'GRAULT'
								})
							]
						})
					]
				}),
				new Rule('bar', {
					respond: [
						new MediaAtRule('baz', {
							quux: 'QUUX',
							respond: [
								new MediaAtRule('corge', {
									garply: 'GARPLY'
								})
							]
						})
					]
				})
			];
			compiler.compileRules(rules, (err, css) => {
				expect(err).to.be.null;
				expect(css).to.eq([
					'@media baz {',
					'  foo {',
					'    qux: QUX;',
					'  }',
					'  @media corge {',
					'    foo {',
					'      grault: GRAULT;',
					'    }',
					'    bar {',
					'      garply: GARPLY;',
					'    }',
					'  }',
					'  bar {',
					'    quux: QUUX;',
					'  }',
					'}'
				].join(newline) + newline);
			});
		});

	});

	function cap(val: string) {
		var fn = <Extender>(() => {
			return [
				['cap', val.toUpperCase()]
			];
		});
		fn.args = arguments;
		return fn;
	};

});
