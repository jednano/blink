import blink = require('../../../../lib/blink');
import sinonChai = require('../../../sinon-chai');

var config = blink.config;
var expect = sinonChai.expect;
var inlineBlock = blink.config.extenders.inlineBlock;

// ReSharper disable WrongExpressionStatement
describe('inlineBlock extender', () => {

	it('generates inline-block, vertical-align and hack declarations', () => {
		var rule = new blink.Rule('foo', {
			extend: [inlineBlock]
		});
		var compiler = new blink.Compiler(config);
		expect(compiler.resolveRules([rule])).to.deep.equal([
			[['foo'], [
				['display', '-moz-inline-stack'],
				['display', 'inline-block'],
				['vertical-align', 'middle'],
				['*vertical-align', 'auto'],
				['zoom', '1'],
				['*display', 'inline']
			]]
		]);
	});

	it('removes CSS hacks when IE 8', () => {
		var rule = new blink.Rule('foo', {
			extend: [inlineBlock]
		});
		config.ie = 8;
		var compiler = new blink.Compiler(config);
		expect(compiler.resolveRules([rule])).to.deep.equal([
			[['foo'], [
				['display', '-moz-inline-stack'],
				['display', 'inline-block'],
				['vertical-align', 'middle']
			]]
		]);
	});

	it('removes display: -moz-inline-stack when firefox 3', () => {
		var rule = new blink.Rule('foo', {
			extend: [inlineBlock]
		});
		config.firefox = 3;
		var compiler = new blink.Compiler(config);
		expect(compiler.resolveRules([rule])).to.deep.equal([
			[['foo'], [
				['display', 'inline-block'],
				['vertical-align', 'middle']
			]]
		]);
	});

	it('changes vertical-align to top when specified', () => {
		var rule = new blink.Rule('foo', {
			extend: [inlineBlock({ verticalAlign: 'top' })]
		});
		var compiler = new blink.Compiler(config);
		expect(compiler.resolveRules([rule])).to.deep.equal([
			[['foo'], [
				['display', 'inline-block'],
				['vertical-align', 'top']
			]]
		]);
	});

	it('removes vertical-align when value is null', () => {
		var rule = new blink.Rule('foo', {
			extend: [inlineBlock({ verticalAlign: null })]
		});
		var compiler = new blink.Compiler(config);
		expect(compiler.resolveRules([rule])).to.deep.equal([
			[['foo'], [
				['display', 'inline-block']
			]]
		]);
	});

});
