import Block = require('../../../lib/Block');
import Configuration = require('../../../lib/Configuration');
import Element = require('../../../lib/Element');
import Modifier = require('../../../lib/Modifier');
import sinonChai = require('../../sinon-chai');

var config = new Configuration();
var expect = sinonChai.expect;

// ReSharper disable WrongExpressionStatement
describe('Block', () => {

	it('compiles a block', () => {
		var block = new Block('a', { b: 'c' });
		expect(block.resolve(config)).to.deep.equal([
			[['.a'], [
				['b', 'c']
			]]
		]);
	});

	it('compiles a block with elements', () => {
		var block = new Block('a', {
			b: 'c',
			elements: [
				new Element('d', {
					e: 'f'
				}),
				new Element('g', {
					h: 'i'
				})
			]
		});
		expect(block.resolve(config)).to.deep.equal([
			[['.a'], [
				['b', 'c']
			]],
			[['.a__d'], [
				['e', 'f']
			]],
			[['.a__g'], [
				['h', 'i']
			]]
		]);
	});

	it('compiles a block with modifiers', () => {
		var block = new Block('a', {
			b: 'c',
			modifiers: [
				new Modifier('d', {
					e: 'f'
				}),
				new Modifier('g', {
					h: 'i'
				})
			]
		});
		expect(block.resolve(config)).to.deep.equal([
			[['.a'], [
				['b', 'c']
			]],
			[['.a--d'], [
				['e', 'f']
			]],
			[['.a--g'], [
				['h', 'i']
			]]
		]);
	});

	it('compiles a block with elements and modifiers', () => {
		var block = new Block('a', {
			b: 'c',
			elements: [
				new Element('d', {
					e: 'f'
				}),
				new Element('g', {
					h: 'i'
				})
			],
			modifiers: [
				new Modifier('j', {
					k: 'l'
				}),
				new Modifier('m', {
					n: 'o'
				})
			]
		});
		expect(block.resolve(config)).to.deep.equal([
			[['.a'], [
				['b', 'c']
			]],
			[['.a__d'], [
				['e', 'f']
			]],
			[['.a__g'], [
				['h', 'i']
			]],
			[['.a--j'], [
				['k', 'l']
			]],
			[['.a--m'], [
				['n', 'o']
			]]
		]);
	});

	it('compiles a block with an element that has a modifier', () => {
		var block = new Block('a', {
			b: 'c',
			elements: [
				new Element('d', {
					e: 'f',
					modifiers: [
						new Modifier('g', {
							h: 'i'
						})
					]
				})
			]
		});
		expect(block.resolve(config)).to.deep.equal([
			[['.a'], [
				['b', 'c']
			]],
			[['.a__d'], [
				['e', 'f']
			]],
			[['.a__d--g'], [
				['h', 'i']
			]]
		]);
	});

	it('compiles a block with a modifier that has an element', () => {
		var block = new Block('a', {
			b: 'c',
			modifiers: [
				new Modifier('d', {
					e: 'f',
					elements: [
						new Element('g', {
							h: 'i'
						})
					]
				})
			]
		});
		expect(block.resolve(config)).to.deep.equal([
			[['.a'], [
				['b', 'c']
			]],
			[['.a--d'], [
				['e', 'f']
			]],
			[['.a--d__g'], [
				['h', 'i']
			]]
		]);
	});

});
