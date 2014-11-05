import BEM = require('../../../lib/BEM');
import Configuration = require('../../../lib/Configuration');
import sinonChai = require('../../sinon-chai');

var config = new Configuration();
var expect = sinonChai.expect;

// ReSharper disable WrongExpressionStatement
describe('BEM Module', () => {

	describe('Block', () => {

		it('compiles a block', () => {
			var block = new BEM.Block('a', { b: 'c' });
			expect(block.resolve(config)).to.deep.equal([
				[['.a'], [
					['b', 'c']
				]]
			]);
		});

		it('compiles a block with elements', () => {
			var block = new BEM.Block('a', {
				b: 'c',
				elements: {
					d: {
						e: 'f'
					},
					g: {
						h: 'i'
					}
				}
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
			var block = new BEM.Block('a', {
				b: 'c',
				modifiers: {
					d: {
						e: 'f'
					},
					g: {
						h: 'i'
					}
				}
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
			var block = new BEM.Block('a', {
				b: 'c',
				elements: {
					d: {
						e: 'f'
					},
					g: {
						h: 'i'
					}
				},
				modifiers: {
					j: {
						k: 'l'
					},
					m: {
						n: 'o'
					}
				}
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
			var block = new BEM.Block('a', {
				b: 'c',
				elements: {
					d: {
						e: 'f',
						modifiers: {
							g: {
								h: 'i'
							}
						}
					}
				}
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
			var block = new BEM.Block('a', {
				b: 'c',
				modifiers: {
					d: {
						e: 'f',
						elements: {
							g: {
								h: 'i'
							}
						}
					}
				}
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

		it('compiles a block with a modifier that has an element with a modifier', () => {
			var block = new BEM.Block('a', {
				b: 'c',
				modifiers: {
					d: {
						e: 'f',
						elements: {
							g: {
								h: 'i',
								modifiers: {
									j: {
										k: 'l'
									}
								}
							}
						}
					}
				}
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
				]],
				[['.a--d__g--j'], [
					['k', 'l']
				]]
			]);
		});

	});

	describe('Element', () => {

		it('compiles an element', () => {
			var element = new BEM.Element('b', { c: 'd' });
			expect(element.resolve('.a', config)).to.deep.equal([
				[['.a__b'], [
					['c', 'd']
				]]
			]);
		});

		it('compiles an element with modifiers', () => {
			var element = new BEM.Element('b', {
				c: 'd',
				modifiers: {
					e: {
						f: 'g'
					},
					h: {
						i: 'j'
					}
				}
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

	describe('Modifier', () => {

		it('compiles a modifier', () => {
			var modifier = new BEM.Modifier('b', { c: 'd' });
			expect(modifier.resolve('.a', config)).to.deep.equal([
				[['.a--b'], [
					['c', 'd']
				]]
			]);
		});

		it('compiles a modifier with elements', () => {
			var modifier = new BEM.Modifier('b', {
				c: 'd',
				elements: {
					e: {
						f: 'g'
					},
					h: {
						i: 'j'
					}
				}
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

});
