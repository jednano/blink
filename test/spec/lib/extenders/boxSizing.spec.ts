import sinonChai = require('../../../sinon-chai');
var expect = sinonChai.expect;
import boxSizing = require('../../../../lib/extenders/boxSizing');


// ReSharper disable WrongExpressionStatement
describe('boxSizing extender', () => {

	it('generates -moz and -webkit vendor prefixes for specified value', () => {
		var decs = boxSizing('border-box')[1]();
		expect(decs).to.deep.equal([
			['-webkit-box-sizing', 'border-box'],
			   ['-moz-box-sizing', 'border-box'],
			        ['box-sizing', 'border-box']
		]);
	});

});
