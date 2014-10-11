import Configuration = require('../../../lib/Configuration');
import Element = require('../../../lib/Element');
import Modifier = require('../../../lib/Modifier');
import sinonChai = require('../../sinon-chai');

var expect = sinonChai.expect;

// ReSharper disable WrongExpressionStatement
describe('Modifier', () => {

	var config = new Configuration();

	it('compiles a modifier', () => {
		var modifier = new Modifier('b', { c: 'd' });
		expect(modifier.resolve('.a', config)).to.deep.equal([
			[['.a--b'], [
				['c', 'd']
			]]
		]);
	});

	it('compiles a modifier with elements', () => {
		var modifier = new Modifier('b', {
			c: 'd',
			elements: [
				new Element('e', {
					f: 'g'
				}),
				new Element('h', {
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
