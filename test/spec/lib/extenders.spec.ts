import Compiler = require('../../../lib/Compiler');
import Configuration = require('../../../lib/Configuration');
import extenders = require('../../../lib/extenders/all');
import Rule = require('../../../lib/Rule');
import sinonChai = require('../../sinon-chai');

var expect = sinonChai.expect;

// ReSharper disable WrongExpressionStatement
describe('extenders', () => {

	describe('experimental extender', () => {

		var config = new Configuration({
			khtmlPrefix: true
		});

		it('generates no declarations when no options are provided', () => {
			var result = extenders.experimental('foo', 'bar')(config);
			expect(result).to.deep.equal([]);
		});

		it('generates all vendor prefixes when their options are set to true', () => {
			var result = extenders.experimental('bar', 'baz', {
				official: true,
				webkit: true,
				khtml: true,
				moz: true,
				ms: true,
				o: true
			})(config);
			expect(result).to.deep.equal([
				['-webkit-bar', 'baz'],
				['-khtml-bar', 'baz'],
				['-moz-bar', 'baz'],
				['-ms-bar', 'baz'],
				['-o-bar', 'baz'],
				['bar', 'baz']
			]);
		});

		it('removes all declarations when the configuration disables them', () => {
			config.set({
				webkitPrefix: false,
				khtmlPrefix: false,
				mozPrefix: false,
				msPrefix: false,
				oPrefix: false
			});
			var result = extenders.experimental('bar', 'baz', {
				official: true,
				webkit: true,
				khtml: true,
				moz: true,
				ms: true,
				o: true
			})(config);
			expect(result).to.deep.equal([
				['bar', 'baz']
			]);
		});

	});

	describe('inlineBlock extender', () => {

		var config = new Configuration();

		it('generates inline-block, vertical-align and hack declarations', () => {
			expect(extenders.inlineBlock()(config)).to.deep.equal([
				['display', '-moz-inline-stack'],
				['display', 'inline-block'],
				['vertical-align', 'middle'],
				['*vertical-align', 'auto'],
				['zoom', '1'],
				['*display', 'inline']
			]);
		});

		it('removes CSS hacks when IE 8', () => {
			config.ie = 8;
			expect(extenders.inlineBlock()(config)).to.deep.equal([
				['display', '-moz-inline-stack'],
				['display', 'inline-block'],
				['vertical-align', 'middle']
			]);
		});

		it('removes display: -moz-inline-stack when firefox 3', () => {
			config.firefox = 3;
			expect(extenders.inlineBlock()(config)).to.deep.equal([
				['display', 'inline-block'],
				['vertical-align', 'middle']
			]);
		});

		it('changes vertical-align to top when specified', () => {
			expect(extenders.inlineBlock({ verticalAlign: 'top' })(config)).to.deep.equal([
				['display', 'inline-block'],
				['vertical-align', 'top']
			]);
		});

		it('removes vertical-align when value is null', () => {
			expect(extenders.inlineBlock({ verticalAlign: null })(config)).to.deep.equal([
				['display', 'inline-block']
			]);
		});

	});

});
