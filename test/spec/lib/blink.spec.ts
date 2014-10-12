import blink = require('../../../lib/blink');
import Block = require('../../../lib/Block');
import Compiler = require('../../../lib/Compiler');
import Configuration = require('../../../lib/Configuration');
import Element = require('../../../lib/Element');
import MediaAtRule = require('../../../lib/MediaAtRule');
import Modifier = require('../../../lib/Modifier');
import Rule = require('../../../lib/Rule');
import sinonChai = require('../../sinon-chai');

var expect = sinonChai.expect;

// ReSharper disable WrongExpressionStatement
describe('blink', () => {

	it('exports class Block', () => {
		expect(new blink.Block('foo')).to.be.instanceof(Block);
	});

	it('exports class Compiler', () => {
		expect(new blink.Compiler()).to.be.instanceof(Compiler);
	});

	it('exports class Configuration', () => {
		expect(new blink.Configuration()).to.be.instanceof(Configuration);
	});

	it('exports class Element', () => {
		expect(new blink.Element('foo')).to.be.instanceof(Element);
	});

	it('exports class MediaAtRule', () => {
		expect(new blink.MediaAtRule('foo')).to.be.instanceof(MediaAtRule);
	});

	it('exports class Modifier', () => {
		expect(new blink.Modifier('foo')).to.be.instanceof(Modifier);
	});

	it('exports class Rule', () => {
		expect(new blink.Rule('foo')).to.be.instanceof(Rule);
	});

});
