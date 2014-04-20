import sinonChai = require('../../sinon-chai');
var expect = sinonChai.expect;
import Blink = require('../../../lib/Blink');


var newline = Blink.configuration.newline;

// ReSharper disable WrongExpressionStatement
describe('Element', () => {

	it('compiles an element', () => {
		var element = new Blink.Element('b', { c: 'd' });
		expect(element.compile('.a', Blink.configuration)).to.eq([
			'.a__b {',
			'  c: d;',
			'}'
		].join(newline) + newline);
	});

	it('compiles an element with modifiers', () => {
		var element = new Blink.Element('b', {
			c: 'd',
			modifiers: [
				new Blink.Modifier('e', {
					f: 'g'
				}),
				new Blink.Modifier('h', {
					i: 'j'
				})
			]
		});
		expect(element.compile('.a', Blink.configuration)).to.eq([
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
