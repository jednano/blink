/// <reference path="../../../bower_components/dt-vinyl/vinyl.d.ts" />
import File = require('vinyl');

import BEM = require('../../../lib/BEM');
import blink = require('../../../lib/blink');
import Compiler = require('../../../lib/Compiler');
import Configuration = require('../../../lib/Configuration');
import plugin = require('../../../lib/plugin');
import Rule = require('../../../lib/Rule');
import sinonChai = require('../../sinon-chai');

var expect = sinonChai.expect;

// ReSharper disable WrongExpressionStatement
describe('blink', () => {

	it('returns a vinyl File when called with a vinyl File', () => {
		var file = new File({ contents: new Buffer('') });
		expect(blink(file)).to.be.instanceof(File);
	});

	it('exports class Block', () => {
		expect(new blink.Block('foo')).to.be.instanceof(BEM.Block);
	});

	it('exports class Compiler', () => {
		expect(new blink.Compiler(new Configuration())).to.be.instanceof(Compiler);
	});

	it('exports class Configuration', () => {
		expect(new blink.Configuration()).to.be.instanceof(Configuration);
	});

	it('exports class Element', () => {
		expect(new blink.Element('foo')).to.be.instanceof(BEM.Element);
	});

	it('exports class Modifier', () => {
		expect(new blink.Modifier('foo')).to.be.instanceof(BEM.Modifier);
	});

	it('exports class Rule', () => {
		expect(new blink.Rule('foo')).to.be.instanceof(Rule);
	});

	it('exports plugin function', () => {
		expect(blink.plugin).to.equal(plugin);
	});

});
