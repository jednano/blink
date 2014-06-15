import sinonChai = require('../../sinon-chai');
var expect = sinonChai.expect;
import blink = require('../../../lib/blink');


var config = blink.config;
var newline = blink.config.newline;

// ReSharper disable WrongExpressionStatement
describe('Element', () => {

	it('compiles an element', () => {
		var element = new blink.Element('b', { c: 'd' });
		expect(element.compile('.a', config)).to.eq([
			'.a__b {',
			'  c: d;',
			'}'
		].join(newline) + newline);
	});

	it('compiles an element with modifiers', () => {
		var element = new blink.Element('b', {
			c: 'd',
			modifiers: [
				new blink.Modifier('e', {
					f: 'g'
				}),
				new blink.Modifier('h', {
					i: 'j'
				})
			]
		});
		expect(element.compile('.a', config)).to.eq([
			'.a__b {',
			'  c: d;',
			'}',
			'',
			'.a__b--e {',
			'  f: g;',
			'}',
			'',
			'.a__b--h {',
			'  i: j;',
			'}'
		].join(newline) + newline);
	});

});
