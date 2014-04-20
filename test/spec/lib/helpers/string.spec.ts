import sinonChai = require('../../../sinon-chai');
var expect = sinonChai.expect;
import Blink = require('../../../../lib/Blink');


var s = require('../../../../lib/helpers/string');

// ReSharper disable WrongExpressionStatement
describe('string helper', () => {

	it('dasherizes strings', () => {
		expect(s.dasherize('fooBarBaz')).to.eq('foo-bar-baz');
		expect(s.dasherize('foo_bar_baz')).to.eq('foo-bar-baz');
		expect(s.dasherize('foo-bar-baz')).to.eq('foo-bar-baz');
		expect(s.dasherize('foo bar baz')).to.eq('foo-bar-baz');
	});

	it('decamelizes strings', () => {
		expect(s.decamelize('fooBarBaz')).to.eq('foo_bar_baz');
		expect(s.decamelize('foo_bar_baz')).to.eq('foo_bar_baz');
		expect(s.decamelize('foo-bar-baz')).to.eq('foo-bar-baz');
		expect(s.decamelize('foo bar baz')).to.eq('foo bar baz');
	});

});
