import os = require('os');

import sinonChai = require('../../sinon-chai');
var expect = sinonChai.expect;
import CompileSettings = require('../../../lib/CompileSettings');
import DeclarationTree = require('../../../lib/DeclarationTree');


// ReSharper disable WrongExpressionStatement
describe('DeclarationTree', () => {

	it('resolves a single declaration', () => {
		var rule = new DeclarationTree({ foo: 'bar' });
		expect(rule.resolve()).to.deep.equal({ foo: 'bar' });
	});

	it('resolves nested rules', () => {
		var rule = new DeclarationTree({ foo: { bar: { baz: 'qux' } } });
		expect(rule.resolve()).to.deep.equal({ 'foo-bar-baz': 'qux' });
	});

	it('resolves pseudo-selectors', () => {
		var rule = new DeclarationTree({ foo: { ':bar': 'baz' } });
		expect(rule.resolve()).to.deep.equal({ 'foo:bar': 'baz' });
	});

	var settings = new CompileSettings();

	it('compiles a single declaration', () => {
		var css = new DeclarationTree({ foo: 'bar' }).compile(settings);
		expect(css).to.eq('  foo: \'bar\';' + settings.newline);
	});

	it('compiles multiple declarations', () => {
		var css = new DeclarationTree({ foo: 'bar', baz: 'qux' }).compile(settings);
		expect(css).to.eq([
			'  foo: \'bar\';',
			'  baz: \'qux\';'
		].join(os.EOL) + settings.newline);
	});

});
