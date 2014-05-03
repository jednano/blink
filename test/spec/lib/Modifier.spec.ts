import sinonChai = require('../../sinon-chai');
var expect = sinonChai.expect;
import Blink = require('../../../lib/Blink');


var config = Blink.config;
var newline = config.newline;

// ReSharper disable WrongExpressionStatement
describe('Modifier', () => {

	it('compiles a modifier', () => {
		var modifier = new Blink.Modifier('b', { c: 'd' });
		expect(modifier.compile('.a', config)).to.eq([
			'.a--b {',
			'  c: d;',
			'}'
		].join(newline) + newline);
	});

	it('compiles a modifier with elements', () => {
		var modifier = new Blink.Modifier('b', {
			c: 'd',
			elements: [
				new Blink.Element('e', {
					f: 'g'
				}),
				new Blink.Element('h', {
					i: 'j'
				})
			]
		});
		expect(modifier.compile('.a', config)).to.eq([
			'.a--b {',
			'  c: d;',
			'}',
			'',
			'.a--b__e {',
			'  f: g;',
			'}',
			'',
			'.a--b__h {',
			'  i: j;',
			'}'
		].join(newline) + newline);
	});

});
