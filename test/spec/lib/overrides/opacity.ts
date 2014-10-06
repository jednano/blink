import blink = require('../../../../lib/blink');
import sinonChai = require('../../../sinon-chai');
import opacity = require('../../../../lib/overrides/opacity');

var config = new blink.Configuration();
var expect = sinonChai.expect;

// ReSharper disable WrongExpressionStatement
describe('opacity override', () => {

	it('by default, generates -ms-filter, filter, -moz, opacity and zoom', () => {
		expect(opacity(0)(config)).to.deep.equal([
			['-ms-filter', 'progid:DXImageTransform.Microsoft.Alpha(Opacity=0)'],
			['filter', 'alpha(opacity=0)'],
			['-moz-opacity', 0],
			['opacity', 0],
			['zoom', 1]
		]);
	});

	it('removes -moz prefix when firefox is version 0.9', () => {
		config.firefox = 0.9;
		expect(opacity(0)(config)).to.deep.equal([
			['-ms-filter', 'progid:DXImageTransform.Microsoft.Alpha(Opacity=0)'],
			['filter', 'alpha(opacity=0)'],
			['opacity', 0],
			['zoom', 1]
		]);
	});

	it('multiplies opacity by 100 and rounds for filter alpha opacities', () => {
		expect(opacity(0.415)(config)).to.deep.equal([
			['-ms-filter', 'progid:DXImageTransform.Microsoft.Alpha(Opacity=42)'],
			['filter', 'alpha(opacity=42)'],
			['opacity', 0.415],
			['zoom', 1]
		]);
	});

	it('changes both filter alphas to "enabled=false" when opacity is 1', () => {
		expect(opacity(1)(config)).to.deep.equal([
			['-ms-filter', 'progid:DXImageTransform.Microsoft.Alpha(enabled=false)'],
			['filter', 'alpha(enabled=false)'],
			['opacity', 1],
			['zoom', 1]
		]);
	});

	it('removes filter declaration and zoom when IE and IE Mobile are version 8', () => {
		config.ie = config.ieMobile = 8;
		expect(opacity(1)(config)).to.deep.equal([
			['-ms-filter', 'progid:DXImageTransform.Microsoft.Alpha(enabled=false)'],
			['opacity', 1]
		]);
	});

	it('removes -ms-filter declaration when IE and IE Mobile are version 9', () => {
		config.ie = config.ieMobile = 9;
		expect(opacity(1)(config)).to.deep.equal([
			['opacity', 1]
		]);
	});

	it('adds -khtml declaration when config.khtmlPrefix is enabled', () => {
		config.khtmlPrefix = true;
		expect(opacity(1)(config)).to.deep.equal([
			['-khtml-opacity', 1],
			['opacity', 1]
		]);
		config.khtmlPrefix = false;
	});

});
