///<reference path="../../../bower_components/dt-vinyl-fs/vinyl-fs.d.ts" />
import File = require('vinyl');
import fs = require('fs');
import path = require('path');
var tap = require('gulp-tap');
var through = require('through2');
var vfs = require('vinyl-fs');

import plugin = require('../../../lib/plugin');
import sinonChai = require('../../sinon-chai');

var expect = sinonChai.expect;

// ReSharper disable WrongExpressionStatement
describe('plugin', () => {

	it('passes a file along with null contents', done => {
		vfs.src('test/fixtures/foo.js')
			.pipe(through.obj((file, enc, cb) => {
				file.contents = null;
				cb(null, file);
			}))
			.pipe(plugin())
			.pipe(tap((file: File) => {
				expect(file.isNull());
				done();
			}));
	});

	it('compiles a file in buffer mode', done => {
		vfs.src('test/fixtures/foo.js')
			.pipe(plugin())
			.pipe(tap((file: File) => {
				expect(file.path).to.eq(path.resolve('test/fixtures/foo.css'));
				var transpiled = readFile(file);
				var expected = readExpected('foo.css');
				expect(transpiled).to.eq(expected);
				done();
			}));
	});

	it('errors when using streaming mode', done => {
		vfs.src('test/fixtures/foo.js', { buffer: false })
			.pipe(plugin())
			.on('error', err => {
				expect(err).to.exist.and.to.have.property('message',
					'Streaming not supported');
				done();
			});
	});

	it('emits errors as plugin errors', done => {
		vfs.src('test/fixtures/invalid_declaration.js')
			.pipe(plugin())
			.on('error', err => {
				expect(err).to.exist.and.to.have.property('message',
					'Invalid declaration property');
				expect(err.constructor.name).to.eq('PluginError');
				done();
			});
	});

	it('emits syntax errors as plugin errors', done => {
		vfs.src('test/fixtures/syntax_error.js')
			.pipe(plugin())
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
