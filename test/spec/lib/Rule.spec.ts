import os = require('os');

import sinonChai = require('../../sinon-chai');
var expect = sinonChai.expect;
import Rule = require('../../../lib/Rule');


// ReSharper disable WrongExpressionStatement
describe('Rule', () => {

	it('compiles a single selector', () => {
		var rule = new Rule(['foo'], { bar: 'baz' });
		expect(rule.compile()).to.eq([
			'foo {',
			'  bar: "baz";',
			'}'
		].join(os.EOL) + os.EOL);
	});

	it('compiles multiple selectors', () => {
		var rule = new Rule(['foo', 'bar'], { baz: 'qux' });
		expect(rule.compile()).to.eq([
			'foo, bar {',
			'  baz: "qux";',
			'}'
		].join(os.EOL) + os.EOL);
	});

});
