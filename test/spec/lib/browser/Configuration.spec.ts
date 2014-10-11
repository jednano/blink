import os = require('os');

import Configuration = require('../../../../lib/browser/Configuration');
import extenders = require('../../../../lib/extenders/all');
import overrides = require('../../../../lib/overrides/all');
import sinonChai = require('../../../sinon-chai');

var expect = sinonChai.expect;

// ReSharper disable WrongExpressionStatement
describe('Configuration for browser', () => {

	var config = new Configuration();

	it('initializes default values from defaults.json file', () => {
		var defaults = require('../../../../defaults.browser.json');
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

	it('JSON strigifies the raw settings when toString() is called', () => {
		expect(config.toString()).to.eq(JSON.stringify(config.raw));
	});

	it('gets and sets the config property', () => {
		config.config = 'foo.json';
		expect(config.config).to.eq('foo.json');
	});

	['quiet', 'trace', 'force', 'boring'].forEach(prop => {
		it('gets and sets the ' + prop + ' property', () => {
			expect(config[prop]).to.be.false;
			config[prop] = true;
			expect(config[prop]).to.be.true;
			config[prop] = false;
		});
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

		it('converts lf and crlf values into newline characters', () => {
			config.style = 'nested';
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

		it('returns a newline when style is nested or expanded', () => {
			config.newline = 'lf';
			config.oneIndent = '2s';
			['nested', 'expanded'].forEach(style => {
				config.style = style;
				expect(config.declarationSeparator).to.eq('\n');
			});
		});

	});

	describe('rule separator', () => {

		it('returns a newline when style is compact', () => {
			config.style = 'compact';
			expect(config.ruleSeparator).to.eq('\n');
		});

		it('returns an empty string when style is compressed', () => {
			config.style = 'compressed';
			expect(config.ruleSeparator).to.eq('');
		});

		it('returns config.newline in all other cases', () => {
			['nested', 'expanded'].forEach(style => {
				config.style = style;
				expect(config.ruleSeparator).to.eq('\n');
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

	it('requires numeric browser version settings', () => {
		var settings = {
			chrome: 'Chrome',
			firefox: 'Firefox',
			ie: 'IE',
			opera: 'Opera',
			safari: 'Safari',
			android: 'Android',
			firefoxMobile: 'Firefox Mobile',
			ieMobile: 'IE Mobile',
			operaMobile: 'Opera Mobile',
			safariMobile: 'Safari Mobile'
		};
		Object.keys(settings).forEach(key => {
			config[key] = 42;
			expect(config[key]).to.eq(42);
			var fn = () => {
				config[key] = 'foo';
			};
			expect(fn).to.throw('Invalid ' + settings[key] + ' version. Expected number.');
		});
	});

	it('gets and sets vendor prefixes', () => {
		['webkit', 'khtml', 'moz', 'ms', 'o'].forEach(vendor => {
			var key = vendor + 'Prefix';
			config[key] = true;
			expect(config[key]).to.be.true;
		});
	});

	it('gets all registered extenders', () => {
		expect(config.extenders).to.deep.equal(extenders);
	});

	it('gets all registered overrides', () => {
		expect(config.overrides).to.deep.equal(overrides);
	});

});
