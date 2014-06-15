import sinonChai = require('../../sinon-chai');
var expect = sinonChai.expect;
import blink = require('../../../lib/blink');


var config = blink.config;
var newline = config.newline;

// ReSharper disable WrongExpressionStatement
describe('Modifier', () => {

	it('compiles a modifier', () => {
		var modifier = new blink.Modifier('b', { c: 'd' });
		expect(modifier.compile('.a', config)).to.eq([
			'.a--b {',
			'  c: d;',
			'}'
		].join(newline) + newline);
	});

	it('compiles a modifier with elements', () => {
		var modifier = new blink.Modifier('b', {
			c: 'd',
			elements: [
				new blink.Element('e', {
					f: 'g'
				}),
				new blink.Element('h', {
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
