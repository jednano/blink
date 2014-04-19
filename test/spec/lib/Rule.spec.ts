import os = require('os');

import sinonChai = require('../../sinon-chai');
var expect = sinonChai.expect;
import Blink = require('../../../lib/Blink');


var newline = Blink.configuration.newline;

// ReSharper disable WrongExpressionStatement
describe('Rule', () => {

	it('compiles a single selector', () => {
		var rule = new Blink.Rule(['foo'], { bar: 'baz' });
		expect(rule.compile()).to.eq([
			'foo {',
			'  bar: "baz";',
			'}'
		].join(newline) + newline);
	});

	it('compiles multiple selectors', () => {
		var rule = new Blink.Rule(['foo', 'bar'], { baz: 'qux' });
		expect(rule.compile()).to.eq([
			'foo, bar {',
			'  baz: "qux";',
			'}'
		].join(newline) + newline);
	});

});
