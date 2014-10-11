///<reference path="../bower_components/dt-vinyl/vinyl.d.ts" />
var concat = require('concat-stream');
var mod = require('module');
import path = require('path');
var through = require('through2');

import CompilerForBrowser = require('./browser/Compiler');
import Configuration = require('./Configuration');

var PluginError = require('gulp-util').PluginError;
var PLUGIN_NAME = 'blink';

class Compiler extends CompilerForBrowser {

	constructor(public config?: Configuration) {
		super(config);
		this.config = config || new Configuration();
	}

	public compile(): NodeJS.ReadWriteStream {

		var compiler = this;

		// ReSharper disable once JsFunctionCanBeConvertedToLambda
		var stream = through.obj(function(file: Vinyl.IFile, enc, done: Function) {

			var onSuccess: Function;
			var onBufferCompiled = function(err: Error, css: string) {
				if (err) {
					this.emit('error', new PluginError(PLUGIN_NAME, err.message));
				} else {
					onSuccess(css);
					file.path = compiler.renameExtToCss(file);
				}
				this.push(file);
				done();
			}.bind(this);

			if (file.isStream()) {
				file.pipe(concat(data => {
					compiler.compileBuffer(data, file.path, onBufferCompiled);
				}));
				onSuccess = css => {
					file.contents = through();
					file.contents.write(css);
				};
				return;
			}

			if (file.isBuffer()) {
				onSuccess = css => {
					file.contents = new Buffer(css);
				};
				compiler.compileBuffer(file.contents, file.path, onBufferCompiled);
				return;
			}

			this.emit('error', new PluginError(PLUGIN_NAME,
				'Unexpected file mode. Expected stream or buffer.'));

			this.push(file);
			done();

		});

		return stream;
	}

	private renameExtToCss(file: Vinyl.IFile) {
		var dir = path.dirname(file.path);
		var basename = path.basename(file.path, path.extname(file.path));
		return path.join(dir, basename + '.css');
	}

	private compileBuffer(data: Buffer, filepath: string,
		callback: (err: Error, css?: string) => void) {
		try {
			super.compile(mod._load(filepath), callback);
		} catch (err) {
			callback(err);
		}
	}

}

export = Compiler;
