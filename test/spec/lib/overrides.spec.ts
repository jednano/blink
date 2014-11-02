import Configuration = require('../../../lib/Configuration');
import overrides = require('../../../lib/overrides/all');
import Rule = require('../../../lib/Rule');
import s = require('../../../lib/helpers/string');
import sinonChai = require('../../sinon-chai');

var expect = sinonChai.expect;

// ReSharper disable WrongExpressionStatement
describe('overrides', () => {

	var config = new Configuration();

	describe('background', () => {

		it('generates shorthand declaration for provided properties', () => {
			var result = overrides.background({
				attachment: 'a',
				clip: 'c1',
				color: 'c2',
				image: 'i',
				origin: 'o',
				position: 'p',
				repeat: 'r',
				size: 's'
			})(config);
			expect(result).to.deep.equal([
				['background', 'a c1 c2 i o p r s']
			]);
			result = overrides.background({
				clip: 'c1',
				image: 'i',
				repeat: 'r',
				size: 's'
			})(config);
			expect(result).to.deep.equal([
				['background', 'c1 i r s']
			]);
		});

		it('generates no declarations when no options are provided', () => {
			var result = overrides.background()(config);
			expect(result).to.be.empty;
		});

	});

	describe('clearfix', () => {

		it('generates clearfix declarations inside :after pseudo-selector', () => {
			var rule = new Rule('foo', {
				clearfix: true
			});
			expect(rule.resolve(config)).to.deep.equal([
				[['foo:after'], [
					['content', s.repeat(config.quote, 2)],
					['display', 'table'],
					['clear', 'both']
				]]
			]);
		});

		it('generates no declarations when value is false', () => {
			expect(overrides.clearfix(false)(config)).to.be.empty;
		});

	});

	describe('fill', () => {

		it('generates fill declarations when value is true', () => {
			expect(overrides.fill(true)(config)).to.deep.equal([
				['position', 'absolute'],
				['top', '0'],
				['right', '0'],
				['bottom', '0'],
				['left', '0']
			]);
		});

		it('generates no declarations when value is false', () => {
			expect(overrides.fill(false)(config)).to.be.empty;
		});

	});

});
