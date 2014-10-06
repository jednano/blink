import os = require('os');

import sinonChai = require('../../sinon-chai');
var expect = sinonChai.expect;
import Configuration = require('../../../lib/Configuration');


// ReSharper disable WrongExpressionStatement
describe('Configuration', () => {

	var config: Configuration;
	beforeEach(() => {
		config = new Configuration();
	});

	it('loads plugins', () => {
		config.loadPlugins({
			plugins: ['../../test/fixtures/myplugin']
		});
		var result = <any>config;
		expect(result.myplugin).to.exist.and.to.deep.equal({
			foo: 'baz',
			bar: 'qux',
			fooCaps: 'BAZ',
			barCaps: 'QUX'
		});
	});

	it('throws an error if the plugin path is not found', () => {
		var fn = () => {
			config.loadPlugins({
				plugins: ['fooplugin']
			});
		};
		expect(fn).to.throw('Invalid plugin. Path not found: fooplugin');
	});

	it('supports overriding plugin settings', () => {
		config.loadPlugins({
			myplugin: {
				bar: 'quux'
			},
			plugins: ['../../test/fixtures/myplugin']
		});
		var result = <any>config;
		expect(result.myplugin).to.exist.and.to.deep.equal({
			foo: 'baz',
			bar: 'quux',
			fooCaps: 'BAZ',
			barCaps: 'QUUX'
		});
	});

	describe('newline setting', () => {

		it('returns an empty string when style is compact or compressed', () => {
			config.style = 'compact';
			expect(config.newline).to.be.empty;
			config.style = 'compressed';
			expect(config.newline).to.be.empty;
		});

		it('converts os value into newline character(s)', () => {
			config.style = 'nested';
			config.newline = 'os';
			expect(config.newline).to.eq(os.EOL);
		});

		it('errors when setting newline to foo', () => {
			var fn = () => {
				config.newline = 'foo';
			};
			expect(fn).to.throw('Unsupported newline: foo');
		});

	});

});
