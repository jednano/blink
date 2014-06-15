import sinonChai = require('../../../sinon-chai');
var expect = sinonChai.expect;
import blink = require('../../../../lib/blink');
import display = require('../../../../lib/extenders/display');
import inlineBlock = require('../../../../lib/extenders/inlineBlock');


var config = blink.config;

// ReSharper disable WrongExpressionStatement
describe('display extender', () => {

	it('calls inlineBlock extender when value is inline-block', () => {
		var decs = display('inline-block')[1](config);
		expect(decs).to.deep.equal(inlineBlock()[1](config));
	});

	it('returns display: none when none is passed in', () => {
		var decs = display('none')[1](config);
		expect(decs).to.deep.equal([
			['display', 'none']
		]);
	});

});
