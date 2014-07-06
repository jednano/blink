import blink = require('../../../../lib/blink');
import sinonChai = require('../../../sinon-chai');

var config = blink.config;
var expect = sinonChai.expect;
var experimental = blink.config.extenders.experimental;

// ReSharper disable WrongExpressionStatement
describe('experimental extender', () => {

	it('generates vendor prefixes for webkit, khtml, moz, ms and o', () => {
		var rule = new blink.Rule('foo', {
			extend: [experimental('bar', 'baz', {
				official: true,
				  webkit: true,
				   khtml: true,
				     moz: true,
				      ms: true,
				       o: true
			})]
		});
		config.khtmlPrefix = true;
		var compiler = new blink.Compiler(config);
		expect(compiler.resolveRules([rule])).to.deep.equal([
			[['foo'], [
				['-webkit-bar', 'baz'],
				 ['-khtml-bar', 'baz'],
				   ['-moz-bar', 'baz'],
				    ['-ms-bar', 'baz'],
				     ['-o-bar', 'baz'],
				        ['bar', 'baz']
			]]
		]);
	});

	it('generates nothing when no options are provided', () => {
		var rule = new blink.Rule('foo', {
			extend: [experimental('foo', 'bar')]
		});
		var compiler = new blink.Compiler(config);
		expect(compiler.resolveRules([rule])).to.deep.equal([]);
	});

});
