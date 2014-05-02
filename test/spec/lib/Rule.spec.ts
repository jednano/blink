import sinonChai = require('../../sinon-chai');
var expect = sinonChai.expect;
import Blink = require('../../../lib/Blink');


var config = Blink.configuration;
var newline = config.newline;

// ReSharper disable WrongExpressionStatement
describe('Rule', () => {

	it('compiles a single selector', () => {
		var rule = new Blink.Rule(['foo'], { bar: 'baz' });
		expect(rule.compile(config)).to.eq([
			'foo {',
			'  bar: baz;',
			'}'
		].join(newline) + newline);
	});

	it('compiles multiple selectors', () => {
		var rule = new Blink.Rule(['foo', 'bar'], { baz: 'qux' });
		expect(rule.compile(config)).to.eq([
			'foo, bar {',
			'  baz: qux;',
			'}'
		].join(newline) + newline);
	});

	it('compiles includes', () => {
		var rule = new Blink.Rule(['.foo'], {
			include: [
				() => {
					return [
						['foo', 'bar'],
						['baz', 'qux']
					];
				}
			]
		});
		expect(rule.compile(config)).to.eq([
			'.foo {',
			'  foo: bar;',
			'  baz: qux;',
			'}'
		].join(newline) + newline);
	});

});
