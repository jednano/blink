import blink = require('../../../lib/blink');
import Configuration = require('../../../lib/Configuration');
import Rule = require('../../../lib/Rule');
import sinonChai = require('../../sinon-chai');

var expect = sinonChai.expect;

// ReSharper disable WrongExpressionStatement
describe('Compiler', () => {

	var config = new Configuration();
	var newline = config.newline;

	it('compiles no rules into an empty string', () => {
		var css = blink([]);
		expect(css).to.be.empty;
	});

	it('compiles an object literal as a Rule', () => {
		var css = blink({ foo: { bar: 'baz' } }, config);
		expect(css).to.eq([
			'foo {',
			'  bar: baz;',
			'}'
		].join(newline) + newline);
	});

	it('compiles multiple rules from an object literal', () => {
		var rules = {
			foo: {
				bar: 'baz'
			},
			waldo: {
				fred: 'thud'
			}
		};
		expect(blink(rules, config)).to.eq([
			'foo {',
			'  bar: baz;',
			'}',
			'waldo {',
			'  fred: thud;',
			'}'
		].join(newline) + newline);
	});

	it('compiles an instance of Rule', () => {
		var rule = new Rule('foo', { bar: 'baz' });
		var css = blink(rule, config);
		expect(css).to.eq([
			'foo {',
			'  bar: baz;',
			'}'
		].join(newline) + newline);
	});

	it('compiles multiple rules from a Rule array', () => {
		var rules = [
			new Rule('foo', {
				bar: 'baz'
			}),
			new Rule('waldo', {
				fred: 'thud'
			})
		];
		expect(blink(rules, config)).to.eq([
			'foo {',
			'  bar: baz;',
			'}',
			'waldo {',
			'  fred: thud;',
			'}'
		].join(newline) + newline);
	});

	it('catches errors on compile', () => {
		var rule = new Rule('foo', { '': 'baz' });
		var fn = () => {
			blink(rule, config);
		};
		expect(fn).to.throw('Invalid declaration property');
	});

	it('compiles a basic rule in a string', () => {
		var contents = 'exports = new Rule("foo", { bar: "baz" });';
		expect(blink(contents, config)).to.eq([
			'foo {',
			'  bar: baz;',
			'}'
		].join(config.newline) + config.newline);
	});

	it('catches errors on string compilation', () => {
		var fn = () => {
			blink('exports = }');
		};
		expect(fn).to.throw('Unexpected token }');
	});

});
