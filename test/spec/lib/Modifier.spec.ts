import sinonChai = require('../../sinon-chai');
var expect = sinonChai.expect;
import blink = require('../../../lib/blink');


var config = blink.config;

// ReSharper disable WrongExpressionStatement
describe('Modifier', () => {

	it('compiles a modifier', () => {
		var modifier = new blink.Modifier('b', { c: 'd' });
		expect(modifier.resolve('.a', config)).to.deep.equal([
			[['.a--b'], [
				['c', 'd']
			]]
		]);
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
		expect(modifier.resolve('.a', config)).to.deep.equal([
			[['.a--b'], [
				['c', 'd']
			]],
			[['.a--b__e'], [
				['f', 'g']
			]],
			[['.a--b__h'], [
				['i', 'j']
			]]
		]);
	});

});
