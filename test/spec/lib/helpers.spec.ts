import a = require('../../../lib/helpers/array');
import o = require('../../../lib/helpers/object');
import s = require('../../../lib/helpers/string');
import sinonChai = require('../../sinon-chai');

var expect = sinonChai.expect;

// ReSharper disable WrongExpressionStatement
describe('helpers', () => {

	describe('array', () => {

		describe('flatten', () => {

			it('flattens deeply-nested arrays', () => {
				expect(a.flatten([[1, 2], [[3, [4, 5]], [6], [], [7, [8]]]]))
					.to.deep.equal([1, 2, 3, 4, 5, 6, 7, 8]);
			});

		});

	});

	describe('object', () => {

		describe('isPlainObject', () => {

			it('validates an object literal', () => {
				expect(o.isPlainObject({})).to.be.true;
			});

			it('validates a newwed-up Object', () => {
				expect(o.isPlainObject(new Object())).to.be.true;
			});

			it('invalidates other object types', () => {
				expect(o.isPlainObject([])).to.be.false;
				expect(o.isPlainObject(new Error())).to.be.false;
				expect(o.isPlainObject('')).to.be.false;
				expect(o.isPlainObject(42)).to.be.false;
				expect(o.isPlainObject(() => {return;})).to.be.false;
			});

		});

	});

	describe('string', () => {

		describe('dasherize', () => {

			it('dasherizes a camel-cased string', () => {
				expect(s.dasherize('fooBarBaz')).to.eq('foo-bar-baz');
			});

			it('dasherizes an underscored string', () => {
				expect(s.dasherize('foo_bar_baz')).to.eq('foo-bar-baz');
			});

			it('dasherizes a spaced string', () => {
				expect(s.dasherize('foo bar baz')).to.eq('foo-bar-baz');
			});

			it('dasherizes a mixed string', () => {
				expect(s.dasherize('fooBar_baz qux-quux')).to.eq('foo-bar-baz-qux-quux');
			});

			it('preserves dashes in a dashed string', () => {
				expect(s.dasherize('foo-bar-baz')).to.eq('foo-bar-baz');
			});

		});

		describe('camelize', () => {

			it('camelizes strings', () => {
				expect(s.camelize('FooBarBaz')).to.eq('fooBarBaz');
			});

			it('camelizes an underscored string', () => {
				expect(s.camelize('foo_bar_baz')).to.eq('fooBarBaz');
			});

			it('camelizes a dashed string', () => {
				expect(s.camelize('foo-bar-baz')).to.eq('fooBarBaz');
			});

			it('camelizes a spaced string', () => {
				expect(s.camelize('foo bar baz')).to.eq('fooBarBaz');
			});

			it('camelizes a mixed string', () => {
				expect(s.camelize('fooBar_baz qux-quux')).to.eq('fooBarBazQuxQuux');
			});

			it('preserves an already camel-cased string', () => {
				expect(s.camelize('fooBarBaz')).to.eq('fooBarBaz');
			});

		});

		describe('decamelize', () => {

			it('decamelizes a camelized string into an underscored string', () => {
				expect(s.decamelize('fooBarBaz')).to.eq('foo_bar_baz');
			});

			it('preserves strings with dashes, underscores and spaces', () => {
				expect(s.decamelize('foo-bar-baz')).to.eq('foo-bar-baz');
				expect(s.decamelize('foo_bar_baz')).to.eq('foo_bar_baz');
				expect(s.decamelize('foo bar baz')).to.eq('foo bar baz');
			});

		});

	});

});
