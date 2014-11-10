///<reference path="../../../bower_components/dt-vinyl-fs/vinyl-fs.d.ts" />
import File = require('vinyl');
var through = require('through2');
import stream = require('stream');

import plugin = require('../../../lib/plugin');
import sinonChai = require('../../sinon-chai');

var expect = sinonChai.expect;

// ReSharper disable WrongExpressionStatement
describe('plugin', () => {

	it('passes a file along with null contents', done => {
		var fakeFile = new File({
			contents: null
		});
		through.obj()
			.pipe(plugin())
			.on('data', file => {
				expect(file.isNull()).to.be.true;
				done();
			})
			.write(fakeFile);
	});

	it('compiles a file in buffer mode', done => {
		var fakeFile = new File({
			path: 'foo.js',
			contents: new Buffer('module.exports={foo:{bar:"baz"}};')
		});
		through.obj()
			.pipe(plugin({ newline: 'lf' }))
			.on('data', file => {
				expect(file.path).to.eq('foo.css');
				var expected = 'foo {\n  bar: baz;\n}\n';
				expect(file.contents.toString()).to.eq(expected);
				done();
			})
			.write(fakeFile);
	});

	it('errors when using streaming mode', done => {
		var fakeFile = new File({
			contents: new stream.Readable()
		});
		through.obj()
			.pipe(plugin())
			.on('error', err => {
				expect(err).to.exist.and.to.have.property('message',
					'Streaming not supported');
				done();
			})
			.write(fakeFile);
	});

	it('emits blink errors as plugin errors', done => {
		var fakeFile = new File({
			contents: new Buffer('module.exports={foo:{"":"baz"}};')
		});
		through.obj()
			.pipe(plugin())
			.on('error', err => {
				expect(err).to.exist.and.to.have.property('message',
					'Invalid declaration property');
				expect(err.constructor.name).to.eq('PluginError');
				done();
			})
			.write(fakeFile);
	});

	it('emits syntax errors as plugin errors', done => {
		var fakeFile = new File({
			contents: new Buffer('module.exports=}')
		});
		through.obj()
			.pipe(plugin())
			.on('error', err => {
				expect(err).to.exist.and.to.have.property('message',
					'Unexpected token }');
				expect(err.constructor.name).to.eq('PluginError');
				done();
			})
			.write(fakeFile);
	});

});
