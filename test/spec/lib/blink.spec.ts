import sinonChai = require('../../sinon-chai');
var expect = sinonChai.expect;
import blink = require('../../../lib/blink');


// ReSharper disable WrongExpressionStatement
describe('blink module', () => {

	it('compiles rules', (done) => {
		var options = {};
		var sources = [new blink.Rule(['foo'], { bar: 'baz' })];

		blink.compile(options, sources, (err, config, result) => {
			if (err) {
				throw err;
			}
			expect(config).to.exist;
			expect(result.contents).to.eq([
				'foo {',
				'  bar: baz;',
				'}'
			].join(config.newline) + config.newline);
			done();
		});
	});

	it('restores configuration after compile', (done) => {

		blink.config.oneIndent = '2s';
		var options = { oneIndent: '4s' };
		var sources = [new blink.Rule(['foo'], { bar: 'baz' })];

		blink.compile(options, sources, (err, config, result) => {
			if (err) {
				throw err;
			}
			expect(config).to.exist;
			expect(result.contents).to.eq([
				'foo {',
				'    bar: baz;',
				'}'
			].join(config.newline) + config.newline);
			done();
		});

		expect(blink.config.oneIndent).to.eq('  ');
	});

});
