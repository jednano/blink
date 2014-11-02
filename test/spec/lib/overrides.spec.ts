import Configuration = require('../../../lib/Configuration');
import extenders = require('../../../lib/extenders/all');
import overrides = require('../../../lib/overrides/all');
import Rule = require('../../../lib/Rule');
import s = require('../../../lib/helpers/string');
import sinonChai = require('../../sinon-chai');

var expect = sinonChai.expect;

// ReSharper disable WrongExpressionStatement
describe('overrides', () => {

	var config = new Configuration();

	describe('appearance', () => {

		it('generates appropriate vendor prefixes', () => {
			expect(overrides.appearance('bar')(config)).to.deep.equal([
				['-webkit-appearance', 'bar'],
				['-moz-appearance', 'bar']
			]);
		});

	});

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

	describe('box', () => {

		it('aliases box.sizing to boxSizing override', () => {
			checkAlias(
				overrides.box({ sizing: 'foo' }),
				overrides.boxSizing('foo')
			);
		});

		it('returns undefined when value is foo', () => {
			expect(overrides.box('foo')).to.be.undefined;
		});

	});

	describe('boxSizing', () => {

		it('generates appropriate vendor prefixes', () => {
			expect(overrides.boxSizing('foo')(config)).to.deep.equal([
				['-webkit-box-sizing', 'foo'],
				['-moz-box-sizing', 'foo'],
				['box-sizing', 'foo']
			]);
		});

		it('removes -webkit prefix when appropriate', () => {
			var resolved = overrides.boxSizing('foo')(<Configuration>config.clone().set({
				chrome: 10,
				safari: 5.1,
				android: 4
			}));
			expect(resolved).to.deep.equal([
				['-moz-box-sizing', 'foo'],
				['box-sizing', 'foo']
			]);
		});

		it('removes -firefox prefix when appropriate', () => {
			var resolved = overrides.boxSizing('foo')(<Configuration>config.clone().set({
				firefox: 29,
				firefoxMobile: 29
			}));
			expect(resolved).to.deep.equal([
				['-webkit-box-sizing', 'foo'],
				['box-sizing', 'foo']
			]);
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

	describe('display', () => {

		describe('inline-block', () => {

			after(() => {
				config = new Configuration();
			});

			it('generates inline-block, vertical-align and hack declarations', () => {
				expect(overrides.display('inline-block')(config)).to.deep.equal([
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
				expect(overrides.display('inline-block')(config)).to.deep.equal([
					['display', '-moz-inline-stack'],
					['display', 'inline-block'],
					['vertical-align', 'middle']
				]);
			});

			it('removes display: -moz-inline-stack when firefox 3', () => {
				config.firefox = 3;
				expect(overrides.display('inline-block')(config)).to.deep.equal([
					['display', 'inline-block'],
					['vertical-align', 'middle']
				]);
			});

			it('changes vertical-align to top when specified', () => {
				expect(overrides.display('inline-block', {
					verticalAlign: 'top'
				})(config)).to.deep.equal([
					['display', 'inline-block'],
					['vertical-align', 'top']
				]);
			});

			it('removes vertical-align when value is null', () => {
				expect(overrides.display('inline-block', {
					verticalAlign: null
				})(config)).to.deep.equal([
					['display', 'inline-block']
				]);
			});

		});

		it('errors when options are passed to the default display property', () => {
			var fn = () => {
				overrides.display('none', { foo: 'bar' })(config);
			};
			expect(fn).to.throw('Unused options for display override');
		});

		it('returns "none" when none is the value', () => {
			expect(overrides.display('none')(config)).to.eq('none');
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

	describe('opacity', () => {

		it('by default, generates -ms-filter, filter, -moz, opacity and zoom', () => {
			expect(overrides.opacity(0)(config)).to.deep.equal([
				['-ms-filter', 'progid:DXImageTransform.Microsoft.Alpha(Opacity=0)'],
				['filter', 'alpha(opacity=0)'],
				['-moz-opacity', 0],
				['opacity', 0],
				['zoom', 1]
			]);
		});

		it('removes -moz prefix when firefox is version 0.9', () => {
			config.firefox = 0.9;
			expect(overrides.opacity(0)(config)).to.deep.equal([
				['-ms-filter', 'progid:DXImageTransform.Microsoft.Alpha(Opacity=0)'],
				['filter', 'alpha(opacity=0)'],
				['opacity', 0],
				['zoom', 1]
			]);
		});

		it('multiplies opacity by 100 and rounds for filter alpha opacities', () => {
			expect(overrides.opacity(0.415)(config)).to.deep.equal([
				['-ms-filter', 'progid:DXImageTransform.Microsoft.Alpha(Opacity=42)'],
				['filter', 'alpha(opacity=42)'],
				['opacity', 0.415],
				['zoom', 1]
			]);
		});

		it('changes both filter alphas to "enabled=false" when opacity is 1', () => {
			expect(overrides.opacity(1)(config)).to.deep.equal([
				['-ms-filter', 'progid:DXImageTransform.Microsoft.Alpha(enabled=false)'],
				['filter', 'alpha(enabled=false)'],
				['opacity', 1],
				['zoom', 1]
			]);
		});

		it('removes filter declaration and zoom when IE and IE Mobile are version 8', () => {
			config.ie = config.ieMobile = 8;
			expect(overrides.opacity(1)(config)).to.deep.equal([
				['-ms-filter', 'progid:DXImageTransform.Microsoft.Alpha(enabled=false)'],
				['opacity', 1]
			]);
		});

		it('removes -ms-filter declaration when IE and IE Mobile are version 9', () => {
			config.ie = config.ieMobile = 9;
			expect(overrides.opacity(1)(config)).to.deep.equal([
				['opacity', 1]
			]);
		});

		it('adds -khtml declaration when config.khtmlPrefix is enabled', () => {
			config.khtmlPrefix = true;
			expect(overrides.opacity(1)(config)).to.deep.equal([
				['-khtml-opacity', 1],
				['opacity', 1]
			]);
			config.khtmlPrefix = false;
		});

	});

	describe('text', () => {

		it('aliases text.size.adjust to textSizeAdjust override', () => {
			checkAlias(
				overrides.text({ size: { adjust: 'foo' } }),
				overrides.textSizeAdjust('foo')
			);
		});

		it('returns undefined when text-size property is supplied', () => {
			expect(overrides.text({ size: 'foo' })).to.be.undefined;
		});

		it('returns undefined when text value is foo', () => {
			expect(overrides.text('foo')).to.be.undefined;
		});

	});

	describe('textSizeAdjust', () => {

		it('generates appropriate vendor prefixes', () => {
			expect(overrides.textSizeAdjust('foo')(config)).to.deep.equal([
				['-webkit-text-size-adjust', 'foo'],
				['-moz-text-size-adjust', 'foo'],
				['-ms-text-size-adjust', 'foo']
			]);
		});

	});

	function checkAlias(override, extender) {
		expect(override(config)).to.deep.equal(extender(config));
	}

});
