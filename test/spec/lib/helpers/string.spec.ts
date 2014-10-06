import sinonChai = require('../../../sinon-chai');
var expect = sinonChai.expect;


var s = require('../../../../lib/helpers/string');

// ReSharper disable WrongExpressionStatement
describe('string helper', () => {

	it('dasherizes strings', () => {
		expect(s.dasherize('fooBarBaz')).to.eq('foo-bar-baz');
		expect(s.dasherize('foo_bar_baz')).to.eq('foo-bar-baz');
		expect(s.dasherize('foo-bar-baz')).to.eq('foo-bar-baz');
		expect(s.dasherize('foo bar baz')).to.eq('foo-bar-baz');
	});

	it('camelizes strings', () => {
		expect(s.camelize('fooBarBaz')).to.eq('fooBarBaz');
		expect(s.camelize('foo_bar_baz')).to.eq('fooBarBaz');
		expect(s.camelize('foo-bar-baz')).to.eq('fooBarBaz');
		expect(s.camelize('foo bar baz')).to.eq('fooBarBaz');
	});

	it('decamelizes strings', () => {
		expect(s.decamelize('fooBarBaz')).to.eq('foo_bar_baz');
		expect(s.decamelize('foo_bar_baz')).to.eq('foo_bar_baz');
		expect(s.decamelize('foo-bar-baz')).to.eq('foo-bar-baz');
		expect(s.decamelize('foo bar baz')).to.eq('foo bar baz');
	});

});
