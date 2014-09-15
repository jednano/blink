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
		defaults = require('../../../../defaults.json');
	});

	describe('newline setting', () => {

		it('converts os value into newline character(s)', () => {
			config.style = 'nested';
			config.newline = 'os';
			expect(config.newline).to.eq(os.EOL);
		});

	});

});
