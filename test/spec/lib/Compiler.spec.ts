import blink = require('../../../lib/browser/blink');
import Compiler = require('../../../lib/Compiler');
import Configuration = require('../../../lib/browser/Configuration');
import MediaAtRule = require('../../../lib/MediaAtRule');
import Rule = require('../../../lib/Rule');
import sinonChai = require('../../sinon-chai');

var expect = sinonChai.expect;

// ReSharper disable WrongExpressionStatement
describe('Compiler', () => {

	var config = new Configuration();
	var compiler = new Compiler(config);
	var newline = config.newline;

	it('compiles no rules into an empty string', done => {
		blink([], (err, css) => {
			expect(err).to.be.null;
			expect(css).to.be.empty;
			done();
		});
	});

	it('compiles an object literal as a Rule', done => {
		blink({ foo: { bar: 'baz' } }, (err, css) => {
			expect(err).to.be.null;
			expect(css).to.eq([
				'foo {',
				'  bar: baz;',
				'}'
			].join(newline) + newline);
			done();
		});
	});

	it('compiles numeric values of 0 as unitless', done => {
		blink({ foo: { bar: 0 } }, (err, css) => {
			expect(err).to.be.null;
			expect(css).to.eq([
				'foo {',
				'  bar: 0;',
				'}'
			].join(newline) + newline);
			done();
		});
	});

	it('compiles non-zero numeric values as px units', done => {
		blink({ foo: { bar: 42 } }, (err, css) => {
			expect(err).to.be.null;
			expect(css).to.eq([
				'foo {',
				'  bar: 42px;',
				'}'
			].join(newline) + newline);
			done();
		});
	});

	it('compiles multiple rules from an object literal', done => {
		var rules = {
			foo: {
				bar: 'baz'
			},
			waldo: {
				fred: 'thud'
			}
		};
		blink(rules, (err, css) => {
			expect(err).to.be.null;
			expect(css).to.eq([
				'foo {',
				'  bar: baz;',
				'}',
				'waldo {',
				'  fred: thud;',
				'}'
			].join(newline) + newline);
			done();
		});
	});

	it('compiles an instance of Rule', done => {
		var rule = new Rule('foo', { bar: 'baz' });
		compiler.compile(rule, (err, css) => {
			expect(err).to.be.null;
			expect(css).to.eq([
				'foo {',
				'  bar: baz;',
				'}'
			].join(newline) + newline);
			done();
		});
	});

	it('catches errors on compile', done => {
		var rule = new Rule('foo', { '': 'baz' });
		compiler.compile(rule, err => {
			expect(err).to.exist.and.to.have.property('message',
				'Invalid declaration property');
			done();
		});
	});

	it('compiles a basic rule in a string', done => {
		var contents = 'exports = new Rule("foo", { bar: "baz" });';
		blink(contents, (err, css) => {
			expect(err).to.be.null;
			expect(css).to.eq([
				'foo {',
				'  bar: baz;',
				'}'
			].join(config.newline) + config.newline);
			done();
		});
	});

	it('catches errors on string compilation', done => {
		var contents = 'exports = }';
		blink(contents, (err) => {
			expect(err).to.exist.and.to.have.property('message', 'Unexpected token }');
			done();
		});
	});

	describe('responders', () => {

		it('compiles a basic responder', () => {
			var rule = new Rule('foo', {
				bar: 'BAR',
				respond: [
					new MediaAtRule('baz', {
						qux: 'QUX'
					})
				]
			});
			compiler.compile(rule, (err, css) => {
				expect(err).to.be.null;
				expect(css).to.eq([
					'foo {',
					'  bar: BAR;',
					'}',
					'@media baz {',
					'  foo {',
					'    qux: QUX;',
					'  }',
					'}'
				].join(newline) + newline);
			});
		});

		it('compiles a nested responder', () => {
			var rule = new Rule('foo', {
				bar: 'BAR',
				respond: [
					new MediaAtRule('baz', {
						qux: 'QUX',
						respond: [
							new MediaAtRule('quux', {
								corge: 'CORGE'
							})
						]
					})
				]
			});
			compiler.compile(rule, (err, css) => {
				expect(err).to.be.null;
				expect(css).to.eq([
					'foo {',
					'  bar: BAR;',
					'}',
					'@media baz {',
					'  foo {',
					'    qux: QUX;',
					'  }',
					'  @media quux {',
					'    foo {',
					'      corge: CORGE;',
					'    }',
					'  }',
					'}'
				].join(newline) + newline);
			});
		});

		it('compiles an empty responder', () => {
			var rule = new Rule('foo', {
				respond: [
					new MediaAtRule('baz', {})
				]
			});
			compiler.compile(rule, (err, css) => {
				expect(err).to.be.null;
				expect(css).to.be.empty;
			});
		});

	});

});
