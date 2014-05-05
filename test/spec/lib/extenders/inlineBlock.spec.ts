import sinonChai = require('../../../sinon-chai');
var expect = sinonChai.expect;
import Blink = require('../../../../lib/Blink');
import inlineBlock = require('../../../../lib/extenders/inlineBlock');


var config = Blink.config;

// ReSharper disable WrongExpressionStatement
describe('inlineBlock extender', () => {

	it('generates inline-block, vertical-align and hack declarations', () => {
		var decs = inlineBlock()[1](config);
		expect(decs).to.deep.equal([
			['display', '-moz-inline-stack'],
			['display', 'inline-block'],
			['vertical-align', 'middle'],
			['*vertical-align', 'auto'],
			['zoom', '1'],
			['*display', 'inline']
		]);
	});

	it('removes CSS hacks when IE 8', () => {
		config.ie = 8;
		var decs = inlineBlock()[1](config);
		expect(decs).to.deep.equal([
			['display', '-moz-inline-stack'],
			['display', 'inline-block'],
			['vertical-align', 'middle']
		]);
	});

	it('removes display: -moz-inline-stack when firefox 3', () => {
		config.firefox = 3;
		var decs = inlineBlock()[1](config);
		expect(decs).to.deep.equal([
			['display', 'inline-block'],
			['vertical-align', 'middle']
		]);
	});

	it('changes vertical-align to top when specified', () => {
		var decs = inlineBlock({ verticalAlign: 'top' })[1](config);
		expect(decs).to.deep.equal([
			['display', 'inline-block'],
			['vertical-align', 'top']
		]);
	});

	it('removes vertical-align when value is null', () => {
		var decs = inlineBlock({ verticalAlign: null })[1](config);
		expect(decs).to.deep.equal([
			['display', 'inline-block']
		]);
	});

});
