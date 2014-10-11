import Configuration = require('../../../lib/Configuration');
import Element = require('../../../lib/Element');
import Modifier = require('../../../lib/Modifier');
import sinonChai = require('../../sinon-chai');

var expect = sinonChai.expect;

// ReSharper disable WrongExpressionStatement
describe('Element', () => {

	var config = new Configuration();

	it('compiles an element', () => {
		var element = new Element('b', { c: 'd' });
		expect(element.resolve('.a', config)).to.deep.equal([
			[['.a__b'], [
				['c', 'd']
			]]
		]);
	});

	it('compiles an element with modifiers', () => {
		var element = new Element('b', {
			c: 'd',
			modifiers: [
				new Modifier('e', {
					f: 'g'
				}),
				new Modifier('h', {
					i: 'j'
				})
			]
		});
		expect(element.resolve('.a', config)).to.deep.equal([
			[['.a__b'], [
				['c', 'd']
			]],
			[['.a__b--e'], [
				['f', 'g']
			]],
			[['.a__b--h'], [
				['i', 'j']
			]]
		]);
	});

});
