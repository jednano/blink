import blink = require('../../../lib/browser/blink');
import Compiler = require('../../../lib/Compiler');
import Configuration = require('../../../lib/browser/Configuration');
import Rule = require('../../../lib/Rule');
import sinonChai = require('../../sinon-chai');

var expect = sinonChai.expect;

// ReSharper disable WrongExpressionStatement
describe('Compiler', () => {

	var config = new Configuration();
	var compiler = new Compiler(config);
	var newline = config.newline;

	it('fails silently if compile is called w/o a callback', () => {
		var fn = () => {
			blink('foo', null);
		};
		expect(fn).not.to.throw(Error);
	});

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

	it('compiles multiple rules from a Rule array', done => {
		var rules = [
			new Rule('foo', {
				bar: 'baz'
			}),
			new Rule('waldo', {
				fred: 'thud'
			})
		];
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

});
