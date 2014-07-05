import sinonChai = require('../../sinon-chai');
var expect = sinonChai.expect;
import blink = require('../../../lib/blink');


// ReSharper disable once InconsistentNaming
var Rule = blink.Rule;
var config = blink.config;

// ReSharper disable WrongExpressionStatement
describe('Rule', () => {

	it('resolves a single declaration', () => {
		var rule = new Rule('foo', { bar: 'baz' });
		expect(rule.resolve(config)).to.deep.equal([
			[['foo'], [
				['bar', 'baz']
			]]
		]);
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

	it('resolves includes', () => {
		var rule = new Rule(['foo'], {
			include: [
				() => {
					return [
						['bar', 'BAR'],
						['baz', 'BAZ']
					];
				}
			]
		});
		expect(rule.resolve(config)).to.deep.equal([
			[['foo'], [
				['bar', 'BAR'],
				['baz', 'BAZ']
			]]
		]);
	});

	it('places current rule before pseudo selector rules', () => {
		var rule = new Rule('foo', {
			bar: 'BAR',
			':baz': {
				qux: 'QUX'
			}
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
			[['foo'], [
				['bar', '42px']
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

	it('provides declaration-value functions the configuration object', () => {
		(<any>config).bar = 'baz';
		var rule = new Rule('foo', {
			bar: (config: any) => {
				return config.bar;
			}
		});
		expect(rule.resolve(config)).to.deep.equal([
			[['foo'], [
				['bar', 'baz']
			]]
		]);
	});

});
