///<reference path="../../../bower_components/dt-vinyl/vinyl.d.ts"/>
import fs = require('fs');
import path = require('path');
var vfs = require('vinyl-fs');
var through = require('through2');

import blink = require('../../../lib/blink');
import sinonChai = require('../../sinon-chai');

var config = blink.config;
var expect = sinonChai.expect;

// ReSharper disable WrongExpressionStatement
describe('Compiler', () => {

	var compiler: blink.Compiler;
	beforeEach(() => {
		compiler = new blink.Compiler(config);
	});

	function readFile(file: Vinyl.IFile) {
		if (file.isStream()) {
			return file.contents.read().toString();
		}
		if (file.isBuffer()) {
			return file.contents.toString();
		}
		throw new Error('Expected stream or buffer');
	}

	function readExpected(filename) {
		return fs.readFileSync(path.join('test', 'expected', filename), {
			encoding: 'utf8'
		});
	}

	it('compiles files in streaming mode', done => {
		vfs.src('test/fixtures/foo.js', { buffer: false })
			.pipe(blink.compile())
			.on('data', file => {
				var transpiled = readFile(file);
				var expected = readExpected('foo.css');
				expect(transpiled).to.eq(expected);
				done();
			});
	});

	it('compiles files in buffer mode', done => {
		vfs.src('test/fixtures/foo.js')
			.pipe(blink.compile())
			.on('data', file => {
				var transpiled = readFile(file);
				var expected = readExpected('foo.css');
				expect(transpiled).to.eq(expected);
				done();
			});
	});

	it('errors when file.contents is null', done => {
		vfs.src('test/fixtures/foo.js')
			.pipe(through.obj(function(file, enc, callback) {
				file.contents = null;
				this.push(file);
				callback();
			}))
			.pipe(blink.compile())
			.on('error', err => {
				expect(err).to.exist.and.to.have.property('message',
					'Unexpected file mode. Expected stream or buffer.');
				done();
			});
	});

	it('compiles master files (i.e., files that include other files)', done => {
		vfs.src('test/fixtures/app.js')
			.pipe(blink.compile())
			.on('data', file => {
				var transpiled = readFile(file);
				var expected = readExpected('app.css');
				expect(transpiled).to.eq(expected);
				done();
			});
	});

	it('emits errors as plugin errors', done => {
		vfs.src('test/fixtures/err1.js')
			.pipe(blink.compile())
			.on('error', err => {
				expect(err).to.exist.and.to.have.property('message',
					'Invalid declaration property');
				expect(err.constructor.name).to.eq('PluginError');
				done();
			});
	});

	it('emits node module parsing errors as plugin errors', done => {
		vfs.src('test/fixtures/err2.js')
			.pipe(blink.compile())
			.on('error', err => {
				expect(err).to.exist.and.to.have.property('message',
					'Unexpected token }');
				expect(err.constructor.name).to.eq('PluginError');
				done();
			});
	});

});
