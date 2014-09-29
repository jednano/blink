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

		it('converts os value into newline character(s)', () => {
			config.style = 'nested';
			config.newline = 'os';
			expect(config.newline).to.eq(os.EOL);
		});

	});

});
