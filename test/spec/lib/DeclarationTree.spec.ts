import sinonChai = require('../../sinon-chai');
var expect = sinonChai.expect;
import Blink = require('../../../lib/Blink');
import DeclarationTree = require('../../../lib/DeclarationTree');


var config = Blink.configuration;
var newline = config.newline;

// ReSharper disable WrongExpressionStatement
describe('DeclarationTree', () => {

	it('resolves a single declaration', () => {
		var rule = new DeclarationTree({ foo: 'bar' });
		expect(rule.resolve()).to.deep.equal({ foo: 'bar' });
	});

	it('resolves nested rules', () => {
		var rule = new DeclarationTree({
			foo: {
				bar: {
					baz: 'BAZ',
					qux: 5,
				},
				baz: 0,
				qux: {
					foo: [7, 'FOO']
				}
			}
		});
		expect(rule.resolve()).to.deep.equal({
			'foo-bar-baz': 'BAZ',
			'foo-bar-qux': 5,
			'foo-baz': 0,
			'foo-qux-foo': [7, 'FOO']
		});
	});

	it('resolves pseudo-selectors', () => {
		var rule = new DeclarationTree({ foo: { ':bar': 'baz' } });
		expect(rule.resolve()).to.deep.equal({ 'foo:bar': 'baz' });
	});

	it('compiles a single declaration', () => {
		var css = new DeclarationTree({ foo: 'bar' }).compile(config);
		expect(css).to.eq('  foo: bar;' + newline);
	});

	it('dasherizes camel-cased properties upon compile', () => {
		var css = new DeclarationTree({ fooBar: 'baz' }).compile(config);
		expect(css).to.eq('  foo-bar: baz;' + newline);
	});

	it('compiles multiple declarations', () => {
		var css = new DeclarationTree({ foo: 'bar', baz: 'qux' }).compile(config);
		expect(css).to.eq([
			'  foo: bar;',
			'  baz: qux;'
		].join(newline) + newline);
	});

	it('quotifies strings with spaces when compiled', () => {
		var css = new DeclarationTree({ foo: 'bar baz qux' }).compile(config);
		expect(css).to.eq([
			'  foo: "bar baz qux";'
		].join(newline) + newline);
	});

	it('compiles numbers with px as the default unit', () => {
		var css = new DeclarationTree({ foo: 42 }).compile(config);
		expect(css).to.eq([
			'  foo: 42px;'
		].join(newline) + newline);
	});

});
