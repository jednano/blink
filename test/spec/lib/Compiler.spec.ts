var extend = require('node.extend');

import blink = require('../../../lib/browser/blink');
import Compiler = require('../../../lib/Compiler');
import Configuration = require('../../../lib/browser/Configuration');
import Extender = require('../../../lib/interfaces/Extender');
import MediaAtRule = require('../../../lib/MediaAtRule');
import o = require('../../../lib/helpers/object');
import Rule = require('../../../lib/Rule');
import sinonChai = require('../../sinon-chai');

var expect = sinonChai.expect;

// ReSharper disable WrongExpressionStatement
describe('Compiler', () => {

	var compiler = new Compiler();
	var config = compiler.config;
	var newline = config.newline;

	var overrides = <any>config.overrides;
	overrides.upper = upper;
	overrides.lower = lower;

	it('provides a configuration if you don\'t provide one', () => {
		expect(new Compiler().config).to.deep.equal(new Configuration());
	});

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
		compiler.compile(rule, (err, css) => {
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
		compiler.compile(rule, err => {
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

	it('compiles overrides', () => {
		var rules = [
			new Rule('foo', {
				upper: 'qux',
				waldo: 'WALDO'
			}),
			new Rule('bar', {
				upper: 'fred',
				thud: 'THUD'
			}),
			new Rule('baz', {
				upper: 'qux',
				garpley: 'GARPLEY'
			})
		];
		compiler.compile(rules, (err, css) => {
			expect(err).to.be.null;
			expect(css).to.eq([
				'foo, baz {',
				'  upper: QUX;',
				'}',
				'bar {',
				'  upper: FRED;',
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
	});

	it('compiles overrides with options', () => {
		var rules = [
			new Rule('foo', {
				upper: ['qux', {
					addFoo: true
				}]
			}),
			new Rule('bar', {
				upper: 'qux'
			}),
			new Rule('baz', {
				upper: ['qux', {
					addFoo: true
				}]
			})
		];
		compiler.compile(rules, (err, css) => {
			expect(err).to.be.null;
			expect(css).to.eq([
				'foo, baz {',
				'  upper: QUXFOO;',
				'}',
				'bar {',
				'  upper: QUX;',
				'}'
			].join(newline) + newline);
		});
	});

	it('supports overrides with more overrides inside of them', () => {

		overrides.caser = caser;

		var rules = [
			new Rule('foo', {
				caser: {
					lower: 'BAR',
					upper: 'baz'
				}
			}),
			new Rule('qux', {
				caser: {
					lower: 'BAR',
					upper: 'quux'
				}
			}),
			new Rule('corge', {
				caser: 'grault'
			})
		];

		compiler.compile(rules, (err, css) => {
			expect(err).to.be.null;
			expect(css).to.eq([
				'foo, qux {',
				'  lower: bar;',
				'}',
				'foo {',
				'  upper: BAZ;',
				'}',
				'qux {',
				'  upper: QUUX;',
				'}',
				'corge {',
				'  caser: grault;',
				'}'
			].join(newline) + newline);
		});

		delete overrides.caser;

		function caser(val: any) {
			if (!o.isPlainObject(val)) {
				return [caserExtender(val)];
			}
			var result = [];
			var cloned = extend({}, val);
			var map = {
				upper: upper,
				lower: lower
			};
			Object.keys(cloned).forEach(key => {
				if (map.hasOwnProperty(key)) {
					result.push(map[key](cloned[key]));
					delete cloned[key];
				}
			});
			if (Object.keys(cloned).length) {
				result.push(caserExtender(cloned));
			}
			return result;
		}

		function caserExtender(val: any) {
			var fn = <Extender>(() => {
				return [
					['caser', val]
				];
			});
			fn.args = arguments;
			return fn;
		}

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
			compiler.compile(rule, (err, css) => {
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
			compiler.compile(rule, (err, css) => {
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

		it('properly overrides inside a responder', () => {
			var rules = [
				new Rule('foo', {
					respond: [
						new MediaAtRule('baz', {
							upper: 'qux'
						})
					]
				}),
				new Rule('bar', {
					respond: [
						new MediaAtRule('baz', {
							upper: 'qux'
						})
					]
				})
			];
			compiler.compile(rules, (err, css) => {
				expect(err).to.be.null;
				expect(css).to.eq([
					'@media baz {',
					'  foo, bar {',
					'    upper: QUX;',
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
			compiler.compile(rules, (err, css) => {
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
			compiler.compile(rules, (err, css) => {
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

	function upper(val: string, options?: { addFoo: boolean }) {
		options = options || <any>{};
		var fn = <Extender>(() => {
			var result = val.toUpperCase();
			if (options.addFoo) {
				result += 'FOO';
			}
			return [
				['upper', result]
			];
		});
		fn.args = arguments;
		return fn;
	};

	function lower(val: string) {
		var fn = <Extender>(() => {
			return [
				['lower', val.toLowerCase()]
			];
		});
		fn.args = arguments;
		return fn;
	}

});
