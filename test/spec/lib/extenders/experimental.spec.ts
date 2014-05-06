import sinonChai = require('../../../sinon-chai');
var expect = sinonChai.expect;
import experimental = require('../../../../lib/extenders/experimental');
import blink = require('../../../../lib/Blink');


var config = blink.config;

// ReSharper disable WrongExpressionStatement
describe('experimental extender', () => {

	it('generates vendor prefixes for webkit, khtml, moz, ms and o', () => {
		config.khtmlPrefix = true;
		var decs = experimental('foo', 'bar', {
			official: true,
			  webkit: true,
			   khtml: true,
			     moz: true,
			      ms: true,
			       o: true
		})[1](config);
		expect(decs).to.deep.equal([
			['-webkit-foo', 'bar'],
			 ['-khtml-foo', 'bar'],
			   ['-moz-foo', 'bar'],
			    ['-ms-foo', 'bar'],
			     ['-o-foo', 'bar'],
			        ['foo', 'bar']
		]);
	});

	it('generates nothing when no options are provided', () => {
		var decs = experimental('foo', 'bar')[1](config);
		expect(decs).to.deep.equal([]);
	});

});
