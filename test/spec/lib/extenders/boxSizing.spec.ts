import sinonChai = require('../../../sinon-chai');
var expect = sinonChai.expect;
import blink = require('../../../../lib/blink');
import boxSizing = require('../../../../lib/extenders/boxSizing');


var config = blink.config;

// ReSharper disable WrongExpressionStatement
describe('boxSizing extender', () => {

	it('generates -moz and -webkit vendor prefixes for specified value', () => {
		var decs = boxSizing('border-box')[1](config);
		expect(decs).to.deep.equal([
			['-webkit-box-sizing', 'border-box'],
			   ['-moz-box-sizing', 'border-box'],
			        ['box-sizing', 'border-box']
		]);
	});

});
