import os = require('os');

import sinonChai = require('../../sinon-chai');
var expect = sinonChai.expect;
import Blink = require('../../../lib/Blink');


var newline = Blink.configuration.newline;

// ReSharper disable WrongExpressionStatement
describe('Modifier', () => {

	it('compiles a modifier', () => {
		var modifier = new Blink.Modifier('c', { d: 'e' });
		expect(modifier.compile('.a__b', Blink.configuration)).to.eq([
			'.a__b--c {',
			'  d: e;',
			'}'
		].join(newline) + newline);
	});

	it('compiles a modifier with more modifiers', () => {
		var modifier = new Blink.Modifier('c', {
			d: 'e',
			modifiers: [
				new Blink.Modifier('f', {
					g: 'h'
				}),
				new Blink.Modifier('i', {
					j: 'k'
				})
			]
		});
		expect(modifier.compile('.a__b', Blink.configuration)).to.eq([
			'.a__b--c {',
			'  d: e;',
			'}',
			'',
			'.a__b--c--f {',
			'  g: h;',
			'}',
			'',
			'.a__b--c--i {',
			'  j: k;',
			'}'
		].join(newline) + newline);
	});

});
