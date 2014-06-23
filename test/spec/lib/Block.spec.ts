import sinonChai = require('../../sinon-chai');
var expect = sinonChai.expect;
import blink = require('../../../lib/blink');


var config = blink.config;

// ReSharper disable WrongExpressionStatement
describe('Block', () => {

	it('compiles a block', () => {
		var block = new blink.Block('a', { b: 'c' });
		expect(block.resolve(config)).to.deep.equal([
			[['.a'], [
				['b', 'c']
			]]
		]);
	});

	it('compiles a block with elements', () => {
		var block = new blink.Block('a', {
			b: 'c',
			elements: [
				new blink.Element('d', {
					e: 'f'
				}),
				new blink.Element('g', {
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
		var block = new blink.Block('a', {
			b: 'c',
			modifiers: [
				new blink.Modifier('d', {
					e: 'f'
				}),
				new blink.Modifier('g', {
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
		var block = new blink.Block('a', {
			b: 'c',
			elements: [
				new blink.Element('d', {
					e: 'f'
				}),
				new blink.Element('g', {
					h: 'i'
				})
			],
			modifiers: [
				new blink.Modifier('j', {
					k: 'l'
				}),
				new blink.Modifier('m', {
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
		var block = new blink.Block('a', {
			b: 'c',
			elements: [
				new blink.Element('d', {
					e: 'f',
					modifiers: [
						new blink.Modifier('g', {
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
		var block = new blink.Block('a', {
			b: 'c',
			modifiers: [
				new blink.Modifier('d', {
					e: 'f',
					elements: [
						new blink.Element('g', {
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
