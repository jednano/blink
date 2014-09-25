import sinonChai = require('../../sinon-chai');
var expect = sinonChai.expect;
import blink = require('../../../lib/blink');

var config = blink.config;
var overrides = config.overrides;
var compiler = new blink.Compiler(config);

// ReSharper disable WrongExpressionStatement
describe('overrides', () => {

	describe('appearance', () => {

		it('generates appropriate vendor prefixes', () => {
			expect(overrides.appearance('bar')(config)).to.deep.equal([
				['-webkit-appearance', 'bar'],
				['-moz-appearance', 'bar']
			]);
		});

	});

	describe('box', () => {

		it('aliases box.sizing to boxSizing extender', () => {
			var ext1 = overrides.box({ sizing: 'foo' });
			var ext2 = overrides.boxSizing('foo');
			expect(getName(ext1)).to.eq(getName(ext2));
		});

		it('generates a single box declaration when value is foo', () => {
			expect(overrides.box('foo')(config)).to.deep.equal([
				['box', 'foo']
			]);
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
			var resolved = overrides.boxSizing('foo')(config.clone().set({
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
			var resolved = overrides.boxSizing('foo')(config.clone().set({
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

		it('generates clearfix declarations when value is true', () => {
			expect(overrides.clearfix(true)(config)).to.deep.equal([
				['content', ''],
				['display', 'table'],
				['clear', 'both']
			]);
		});

		it('inserts clearfix declarations inside :after pseudo-selector', () => {
			var rule = new blink.Rule('foo', {
				clearfix: true
			});
			expect(compiler.resolveRules([rule])).to.deep.equal([
				[['foo:after'], [
					['content', ''],
					['display', 'table'],
					['clear', 'both']
				]]
			]);
		});

		it('generates nothing when value is false', () => {
			expect(overrides.clearfix(false)(config)).to.deep.equal([]);
			var rule = new blink.Rule('foo', {
				clearfix: false
			});
			expect(compiler.resolveRules([rule])).to.deep.equal([]);
		});

	});

	describe('text', () => {

		it('aliases text.size.adjust to textSizeAdjust extender', () => {
			var ext1 = overrides.text({ size: { adjust: 'foo' } });
			var ext2 = overrides.textSizeAdjust('foo');
			expect(getName(ext1)).to.eq(getName(ext2));
		});

		it('generates a single text declaration when value is foo', () => {
			expect(overrides.text('foo')(config)).to.deep.equal([
				['text', 'foo']
			]);
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

	function getName(extender) {
		return (<any>extender.args.callee).name;
	}

});
