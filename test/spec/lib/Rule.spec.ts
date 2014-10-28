import Configuration = require('../../../lib/Configuration');
import Rule = require('../../../lib/Rule');
import o = require('../../../lib/helpers/object');
import s = require('../../../lib/helpers/string');
import sinonChai = require('../../sinon-chai');

var expect = sinonChai.expect;

// ReSharper disable WrongExpressionStatement
describe('Rule', () => {

	var config = new Configuration();

	it('resolves an empty body into an empty array', () => {
		var rule = new Rule('foo');
		expect(rule.resolve(config)).to.deep.equal([]);
	});

	it('resolves a single declaration', () => {
		var rule = new Rule('foo', { bar: 'baz' });
		expect(rule.resolve(config)).to.deep.equal([
			[['foo'], [
				['bar', 'baz']
			]]
		]);
	});

	it('resolves an undefined declaration value as nothing', () => {
		var rule = new Rule('foo', {
			bar: void(0)
		});
		expect(rule.resolve(config)).to.deep.equal([]);
	});

	it('supports and trims string array selectors', () => {
		var rule = new Rule(['  foo  ', '  bar  '], {
			baz: 'BAZ'
		});
		expect(rule.resolve(config)).to.deep.equal([
			[['foo', 'bar'], [
				['baz', 'BAZ']
			]]
		]);
	});

	it('supports and trims selectors in string format', () => {
		var rule = new Rule('  foo  ,  bar  ', {
			baz: 'BAZ'
		});
		expect(rule.resolve(config)).to.deep.equal([
			[['foo', 'bar'], [
				['baz', 'BAZ']
			]]
		]);
	});

	it('resolves multiple declarations', () => {
		var rule = new Rule('foo, bar', {
			baz: 'BAZ',
			qux: 'QUX'
		});
		expect(rule.resolve(config)).to.deep.equal([
			[['foo', 'bar'], [
				['baz', 'BAZ'],
				['qux', 'QUX']
			]]
		]);
	});

	it('resolves nested declarations', () => {
		var rule = new Rule('foo', {
			bar: {
				baz: {
					qux: 'QUX',
					quux: 'QUUX',
				},
				corge: 'CORGE',
				grault: {
					garply: ['waldo', 'fred']
				}
			}
		});
		expect(rule.resolve(config)).to.deep.equal([
			[['foo'], [
				['bar-baz-qux', 'QUX'],
				['bar-baz-quux', 'QUUX'],
				['bar-corge', 'CORGE'],
				['bar-grault-garply', 'waldo fred']
			]]
		]);
	});

	it('places current rule before pseudo selector rules', () => {
		var rule = new Rule('foo', {
			':baz': {
				qux: 'QUX'
			},
			bar: 'BAR'
		});
		expect(rule.resolve(config)).to.deep.equal([
			[['foo'], [
				['bar', 'BAR']
			]],
			[['foo:baz'], [
				['qux', 'QUX']
			]]
		]);
	});

	it('resolves nested pseudo-selectors', () => {
		var rule = new Rule('foo, bar', {
			':baz, :qux': {
				':quux': {
					corge: 'CORGE'
				},
				':grault': {
					garply: 'GARPLY'
				}
			}
		});
		expect(rule.resolve(config)).to.deep.equal([
			[['foo:baz:quux', 'foo:qux:quux', 'bar:baz:quux', 'bar:qux:quux'], [
				['corge', 'CORGE']
			]],
			[['foo:baz:grault', 'foo:qux:grault', 'bar:baz:grault', 'bar:qux:grault'], [
				['garply', 'GARPLY']
			]]
		]);
	});

	it('dasherizes camel-cased properties upon resolve', () => {
		var rule = new Rule('foo', { barBaz: 'qux' });
		expect(rule.resolve(config)).to.deep.equal([
			[['foo'], [
				['bar-baz', 'qux']
			]]
		]);
	});

	it('quotifies string declaration values with spaces', () => {
		var css = new Rule('foo', {
			bar: 'baz qux quux'
		}).resolve(config);
		expect(css).to.deep.equal([
			[['foo'], [
				['bar', '"baz qux quux"']
			]]
		]);
	});

	it('resolves numbers with px as the default unit', () => {
		var rule = new Rule('foo', { bar: 42 });
		expect(rule.resolve(config)).to.deep.equal([
			[
				['foo'], [
					['bar', '42px']
				]
			]
		]);
	});

	it('joins an array of declaration values with spaces', () => {
		var rule = new Rule('foo', {
			bar: ['baz', 42, 'qux quux']
		});
		expect(rule.resolve(config)).to.deep.equal([
			[['foo'], [
				['bar', 'baz 42px "qux quux"']
			]]
		]);
	});

	it('resolves empty string values as empty quotes', () => {
		var rule = new Rule('foo', {
			bar: ''
		});
		expect(rule.resolve(config)).to.deep.equal([
			[['foo'], [
				['bar', s.repeat(config.quote, 2)]
			]]
		]);
	});

	it('resolves declaration-value functions', () => {
		var rule = new Rule('foo', {
			bar: () => {
				return 'baz';
			}
		});
		expect(rule.resolve(config)).to.deep.equal([
			[['foo'], [
				['bar', 'baz']
			]]
		]);
	});

	it('provides the configuration object to declaration-value functions', () => {
		(<any>config).bar = 'baz';
		var rule = new Rule('foo', {
			bar: (c) => {
				return c.bar;
			}
		});
		expect(rule.resolve(config)).to.deep.equal([
			[['foo'], [
				['bar', 'baz']
			]]
		]);
	});

	describe('overrides', () => {

		var overrides = <any>config.overrides;

		before(() => {
			overrides.upper = upper;
			function upper(value: string, options?: { addBaz?: boolean }) {
				options = options || {};
				return (c: Configuration) => {
					expect(c).to.be.instanceof(Configuration);
					if (options.addBaz) {
						value += 'BAZ';
					}
					return value.toUpperCase();
				};
			}
		});

		after(() => {
			delete overrides.upper;
		});

		it('resolves an override', () => {
			var rule = new Rule('foo', {
				upper: 'bar'
			});
			expect(rule.resolve(config)).to.deep.equal([
				[['foo'], [
					['upper', 'BAR']
				]]
			]);
		});

		it('resolves an override with options', () => {
			var rule = new Rule('foo', {
				upper: ['bar', {
					addBaz: true
				}]
			});
			expect(rule.resolve(config)).to.deep.equal([
				[['foo'], [
					['upper', 'BARBAZ']
				]]
			]);
		});

		it('errors when an override is not a function', () => {
			overrides.bar = 'baz';
			var fn = () => {
				new Rule('foo', {
					bar: true
				}).resolve(config);
			};
			expect(fn).to.throw('Override "bar" must be of type: Function');
			delete overrides.bar;
		});

		it('errors when an override does not return a function', () => {
			overrides.bar = () => {
				return 'baz';
			};
			var fn = () => {
				new Rule('foo', {
					bar: true
				}).resolve(config);
			};
			expect(fn).to.throw('Override "bar" must return a function');
			delete overrides.bar;
		});

	});

	it('compiles into CSS via the compile method', () => {
		var rule = new Rule('foo', { bar: 'baz' });
		expect(rule.compile(config)).to.eq([
			'foo {',
			config.oneIndent + 'bar: baz;',
			'}'
		].join(config.newline) + config.newline);
	});

});
