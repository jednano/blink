var concat = require('concat-stream');
var mod = require('module');
import path = require('path');
var through = require('through2');

import a = require('./helpers/array');
import CompilerBrowser = require('./CompilerBrowser');
import Configuration = require('./Configuration');


var PluginError = require('gulp-util').PluginError;
var PLUGIN_NAME = 'blink';

class Compiler extends CompilerBrowser {

	constructor(public config?: Configuration) {
		super(config);
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
		return path.join(file.base,
			path.basename(file.path, path.extname(file.path)) + '.css');
	}

	private compileBuffer(data: Buffer, filepath: string,
		callback: (err: Error, css: string) => void) {

		if (filepath) {
			var rules = a.flatten([mod._load(filepath)]);
			super.compileRules(rules, callback);
		} else {
			super.compile(data.toString(), callback);
		}
	}

	public compileModule(contents: Buffer) {
		return super.compileModule(contents.toString());
	}

}

export = Compiler;
