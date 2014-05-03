import os = require('os');

import sinonChai = require('../../sinon-chai');
var expect = sinonChai.expect;
import Configuration = require('../../../lib/Configuration');


// ReSharper disable WrongExpressionStatement
describe('Configuration', () => {

	var config: Configuration;
	var defaults: Configuration;
	before(() => {
		config = new Configuration();
		defaults = require('../../../defaults.json');
	});

	it('initializes default values from defaults.json file', () => {
		expect(config.raw.style).to.eq(defaults.style);
		expect(config.raw.oneIndent).to.eq(defaults.oneIndent);
		expect(config.raw.newline).to.eq(defaults.newline);
		expect(config.raw.quote).to.eq(defaults.quote);
		expect(config.raw.block).to.eq(defaults.block);
		expect(config.raw.element).to.eq(defaults.element);
		expect(config.raw.modifier).to.eq(defaults.modifier);
		expect(config.raw.chrome).to.eq(defaults.chrome);
		expect(config.raw.firefox).to.eq(defaults.firefox);
		expect(config.raw.ie).to.eq(defaults.ie);
		expect(config.raw.opera).to.eq(defaults.opera);
	});

	it('supports setting multiple configuration options in a batch', () => {
		config.set({
			style: 'expanded',
			oneIndent: '1t',
			newline: 'crlf'
		});
		expect(config.raw.style).to.eq('expanded');
		expect(config.raw.oneIndent).to.eq('1t');
		expect(config.raw.newline).to.eq('crlf');
	});

	it('supports only nested, expanded, compact and compressed styles', () => {
		['nested', 'expanded', 'compact', 'compressed'].forEach(style => {
			config.style = style;
			expect(config.style).to.eq(style);
		});
		var fn = () => {
			config.style = 'foo';
		};
		expect(fn).to.throw('Unsupported style: foo');
	});

	describe('oneIndent setting', () => {

		it('converts value into specified number of spaces or tabs', () => {
			config.style = 'nested';
			config.oneIndent = '1s';
			expect(config.oneIndent).to.eq(' ');
			config.oneIndent = '12s';
			expect(config.oneIndent).to.eq('            ');
			config.oneIndent = '1t';
			expect(config.oneIndent).to.eq('\t');
			config.oneIndent = '3t';
			expect(config.oneIndent).to.eq('\t\t\t');
		});

		it('converts all zero-based values into an empty string', () => {
			config.style = 'nested';
			[0, '0', '0s', '0t', '0foo'].forEach(value => {
				config.oneIndent = value;
				expect(config.oneIndent).to.be.empty;
			});
		});

		it('returns an empty string when style is compact or compressed', () => {
			config.oneIndent = '2s';
			['nested', 'expanded'].forEach(style => {
				config.style = style;
				expect(config.oneIndent).to.eq('  ');
			});
			['compact', 'compressed'].forEach(style => {
				config.style = style;
				expect(config.oneIndent).to.be.empty;
			});
		});

		it('errors when value does not match the required format', () => {
			var fn = () => {
				config.oneIndent = 'foo';
			};
			expect(fn).to.throw('Unsupported oneIndent format: foo');
		});

	});

	describe('newline setting', () => {

		it('converts os, lf and crlf values into newline characters', () => {
			config.style = 'nested';
			config.newline = 'os';
			expect(config.newline).to.eq(os.EOL);
			config.newline = 'lf';
			expect(config.newline).to.eq('\n');
			config.newline = 'crlf';
			expect(config.newline).to.eq('\r\n');
		});

		it('returns an empty string when style is compact or compressed', () => {
			config.newline = 'lf';
			['nested', 'expanded'].forEach(style => {
				config.style = style;
				expect(config.newline).to.be.eq('\n');
			});
			['compact', 'compressed'].forEach(style => {
				config.style = style;
				expect(config.newline).to.be.empty;
			});
		});

		it('errors when value is not supported', () => {
			var fn = () => {
				config.newline = 'foo';
			};
			expect(fn).to.throw('Unsupported newline: foo');
		});

	});

	describe('quote setting', () => {

		it('converts double and single quote settings into quote characters', () => {
			config.quote = 'double';
			expect(config.quote).to.eq('"');
			config.quote = 'single';
			expect(config.quote).to.eq("'");
		});

		it('errors when value is not supported', () => {
			var fn = () => {
				config.quote = 'foo';
			};
			expect(fn).to.throw('Unsupported quote type: foo');
		});

	});

	it('converts oneSpace into an empty string when style is compressed only', () => {
		['nested', 'expanded', 'compact'].forEach(style => {
			config.style = style;
			expect(config.oneSpace).to.eq(' ');
		});
		config.style = 'compressed';
		expect(config.oneSpace).to.be.empty;
	});

	describe('declaration separator', () => {

		it('returns a single space when style is compact', () => {
			config.style = 'compact';
			expect(config.declarationSeparator).to.eq(' ');
		});

		it('returns an empty string when style is compressed', () => {
			config.style = 'compressed';
			expect(config.declarationSeparator).to.be.empty;
		});

		it('returns a newline + one indent when style is nested or expanded', () => {
			config.newline = 'lf';
			config.oneIndent = '2s';
			['nested', 'expanded'].forEach(style => {
				config.style = style;
				expect(config.declarationSeparator).to.eq('\n  ');
			});
		});

	});

	it('requires a "%s" inside block, element and modifier settings', () => {
		['block', 'element', 'modifier'].forEach(setting => {
			config[setting] = 'foo%sbar';
			expect(config[setting]).to.eq('foo%sbar');
			var fn = () => {
				config[setting] = 'foo';
			};
			expect(fn).to.throw('Invalid ' + setting + ' format. Expected "%s".');
		});
	});

	it('requires a number for Chrome, Firefox, IE and Opera settings', () => {
		['Chrome', 'Firefox', 'IE', 'Opera'].forEach(setting => {
			var key = setting.toLowerCase();
			config[key] = 42;
			expect(config[key]).to.eq(42);
			var fn = () => {
				config[key] = 'foo';
			};
			expect(fn).to.throw('Invalid ' + setting + ' version. Expected number.');
		});
	});

});
