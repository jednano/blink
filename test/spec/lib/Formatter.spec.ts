import sinonChai = require('../../sinon-chai');
var expect = sinonChai.expect;
import Blink = require('../../../lib/Blink');
import Formatter = require('../../../lib/Formatter');


var config = Blink.config;
var newline = config.newline;

// ReSharper disable WrongExpressionStatement
describe.only('Formatter', () => {

	var f: Formatter;
	before(() => {
		f = new Formatter();
	});

	it('formats an empty array into an empty string', () => {
		var css = f.format(config, []);
		expect(css).to.eq('');
	});

	it('formats an empty rule into an empty string', () => {
		var css = f.format(config, [
			['.foo', []]
		]);
		expect(css).to.eq('');

		css = f.format(config, [
			['.foo', '']
		]);
		expect(css).to.eq('');
	});

	it('properly formats a rule with one declaration', () => {
		var css = f.format(config, [
			['.foo', [
				['bar', 'BAR']
			]]
		]);
		expect(css).to.eq([
			'.foo {',
			'  bar: BAR;',
			'}'
		].join(newline) + newline);
	});

	it('properly formats a rule with two declarations', () => {
		var css = f.format(config, [
			['.foo', [
				['bar', 'BAR'],
				['baz', 'BAZ']
			]]
		]);
		expect(css).to.eq([
			'.foo {',
			'  bar: BAR;',
			'  baz: BAZ;',
			'}'
		].join(newline) + newline);
	});

	it('properly formats a deeply-nested at-rule', () => {
		var css = f.format(config, [
			['@foo', [
				['@bar', [
					['.baz', [
						['qux', 'QUX'],
						['quux', 'QUUX']
					]]
				]]
			]]
		]);
		expect(css).to.eq([
			'@foo {',
			'  @bar {',
			'    .baz {',
			'      qux: QUX;',
			'      quux: QUUX;',
			'    }',
			'  }',
			'}'
		].join(newline) + newline);
	});

});
