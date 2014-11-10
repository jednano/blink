///<reference path="../../../bower_components/dt-vinyl-fs/vinyl-fs.d.ts" />
import File = require('vinyl');

import Configuration = require('../../../lib/Configuration');
import sinonChai = require('../../sinon-chai');
import VinylCompiler = require('../../../lib/VinylCompiler');

var expect = sinonChai.expect;

// ReSharper disable WrongExpressionStatement
describe('VinylCompiler', () => {

	var config = new Configuration();
	var compiler = new VinylCompiler(config);
	var newline = config.newline;
	var input = 'module.exports = { foo: { bar: "baz" }};';
	var fakeFile = new File({ contents: new Buffer(input) });
	var result = compiler.compile(fakeFile);

	it('compiles into expected CSS', () => {
		var expected = [
			'foo {',
			'  bar: baz;',
			'}'
		].join(newline) + newline;
		expect(result.contents.toString()).to.eq(expected);
	});

	it('returns a vinyl File object', () => {
		expect(result).to.be.instanceof(File);
	});

	it('returns a file with an extension of .css', () => {
		expect(result.path).to.match(/\.css$/);
	});

	it('does not modify the original file', () => {
		expect(fakeFile.contents.toString()).to.eq(input);
	});

});
