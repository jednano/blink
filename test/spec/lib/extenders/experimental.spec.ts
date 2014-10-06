import blink = require('../../../../lib/blink');
import sinonChai = require('../../../sinon-chai');
import experimental = require('../../../../lib/extenders/experimental');

var config = new blink.Configuration();
var expect = sinonChai.expect;

// ReSharper disable WrongExpressionStatement
describe('experimental extender', () => {

	before(() => {
		config.khtmlPrefix = true;
	});

	it('generates no declarations when no options are provided', () => {
		var result = experimental('foo', 'bar')(config);
		expect(result).to.deep.equal([]);
	});

	it('generates all vendor prefixes when their options are set to true', () => {
		var result = experimental('bar', 'baz', {
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
		var result = experimental('bar', 'baz', {
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
