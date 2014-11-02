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

		it('inserts shorthand declaration for all background properties', () => {
			var result = overrides.background({
				position: 'corge',
				repeat: 'qux',
				image: 'baz',
				color: 'bar',
				attachment: 'quux'
			})(config);
			expect(result).to.deep.equal([
				['background', 'bar baz qux quux corge']
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
