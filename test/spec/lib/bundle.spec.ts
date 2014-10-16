///<reference path="../../../bower_components/dt-vinyl-fs/vinyl-fs.d.ts" />
import File = require('vinyl');
import fs = require('fs');
import path = require('path');
var through = require('through2');
var vfs = require('vinyl-fs');

import blink = require('../../../lib/blink');
import sinonChai = require('../../sinon-chai');

var expect = sinonChai.expect;

// ReSharper disable WrongExpressionStatement
describe('bundle function', () => {

	it('compiles a file in buffer mode', done => {
		vfs.src('test/fixtures/foo.js')
			.pipe(blink('foo.css'))
			.on('data', file => {
				expect(file.path).to.eq(path.resolve('test/fixtures/foo.css'));
				var transpiled = readFile(file);
				var expected = readExpected('foo.css');
				expect(transpiled).to.eq(expected);
				done();
			});
	});

	it('errors when using streaming mode', done => {
		vfs.src('test/fixtures/foo.js', { buffer: false })
			.pipe(blink('foo.css'))
			.on('error', err => {
				expect(err).to.exist.and.to.have.property('message',
					'Streaming not supported');
				done();
			});
	});

	it('ignores (passes along) a file with null contents', done => {
		vfs.src('test/fixtures/foo.js')
			.pipe(through.obj(function(file, enc, callback) {
				file.contents = null;
				this.push(file);
				callback();
			}))
			.pipe(blink('foo.css'))
			.on('end', () => {
				done();
			});
	});

	it('uses the provided output File object\'s path, if provided', done => {
		vfs.src('test/fixtures/foo.js')
			.pipe(blink(new File({ path: 'foo.css' })))
			.on('data', file => {
				expect(file.path).to.eq('foo.css');
				var transpiled = readFile(file);
				var expected = readExpected('foo.css');
				expect(transpiled).to.eq(expected);
				done();
			});
	});

	it('uses the provided output path, if provided', done => {
		vfs.src('test/fixtures/foo.js')
			.pipe(blink({ path: 'foo.css' }))
			.on('data', file => {
				expect(file.path).to.eq('foo.css');
				var transpiled = readFile(file);
				var expected = readExpected('foo.css');
				expect(transpiled).to.eq(expected);
				done();
			});
	});

	it('errors when no output file or filename is provided', () => {
		var b = <any>blink;
		var fn = () => {
			vfs.src('test/fixtures/foo.js').pipe(b());
		};
		expect(fn).to.throw('Missing output file argument');
	});

	it('errors when the provided output file has no path', () => {
		var fn = () => {
			vfs.src('test/fixtures/foo.js').pipe(blink(new File()));
		};
		expect(fn).to.throw('Missing path in provided output file');
	});

	it('bundles two files into one', done => {
		vfs.src(['test/fixtures/foo.js', 'test/fixtures/bar.js'])
			.pipe(blink('styles.css'))
			.on('data', file => {
				expect(file.path).to.eq(path.resolve('test/fixtures/styles.css'));
				expect(file.contents.toString()).to.eq(readExpected('app.css'));
				done();
			});
	});

	it('emits errors as plugin errors', done => {
		vfs.src('test/fixtures/invalid_declaration.js')
			.pipe(blink('err.css'))
			.on('error', err => {
				expect(err).to.exist.and.to.have.property('message',
					'Invalid declaration property');
				expect(err.constructor.name).to.eq('PluginError');
				done();
			});
	});

	it('emits syntax errors as plugin errors', done => {
		vfs.src('test/fixtures/syntax_error.js')
			.pipe(blink('err.css'))
			.on('error', err => {
				expect(err).to.exist.and.to.have.property('message',
					'Unexpected token }');
				expect(err.constructor.name).to.eq('PluginError');
				done();
			});
	});

	function readFile(file: File) {
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

});
