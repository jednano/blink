///<reference path="../bower_components/dt-gulp-util/gulp-util.d.ts" />
import File = require('vinyl');
import gutil = require('gulp-util');
var mod = require('module');
import path = require('path');
var through = require('through');

import Compiler = require('./Compiler');
import Configuration = require('./Configuration');
import ConfigurationOptions = require('./interfaces/ConfigurationOptions');

var PLUGIN_NAME = 'blink';
var PluginError = gutil.PluginError;

// ReSharper disable once UnusedLocals
function bundle(outputFilename: string, options?: ConfigurationOptions): NodeJS.ReadWriteStream;
function bundle(outputFile: File, options?: ConfigurationOptions): NodeJS.ReadWriteStream;
function bundle(output: { path: string }, options?: ConfigurationOptions): NodeJS.ReadWriteStream;
function bundle(output: any, options?: ConfigurationOptions): NodeJS.ReadWriteStream {

	if (!output) {
		throw new PluginError(PLUGIN_NAME, 'Missing output file argument');
	}

	var firstFile: File = null;
	if (typeof output !== 'string') {
		if (typeof output.path !== 'string') {
			throw new PluginError(PLUGIN_NAME, 'Missing path in provided output file');
		}
		firstFile = (output instanceof File) ? output : new File(output);
	}

	var rules = [];

	// ReSharper disable once DuplicatingLocalDeclaration
	function bufferContents(file: File) {
		if (file.isNull()) {
			return;
		}
		if (file.isStream()) {
			this.emit('error', new PluginError(PLUGIN_NAME, 'Streaming not supported'));
			return;
		}
		if (!firstFile) {
			firstFile = file;
		}
		try {
			rules.push(compileModule(file));
		} catch (err) {
			this.emit('error', new PluginError(PLUGIN_NAME, err.message, {
				showStack: true
			}));
		}

		function compileModule(f) {
			var m = new mod();
			m.paths = mod._nodeModulePaths(path.dirname(f.path));
			m._compile(f.contents.toString());
			return m.exports;
		}
	}

	function endStream() {
		if (!firstFile) {
			this.emit('end');
			return;
		}
		var outputFile = firstFile;

		if (typeof output === 'string') {
			outputFile = firstFile.clone({ contents: false });
			outputFile.path = path.join(firstFile.base, output);
		}

		var config = new Configuration(options);
		new Compiler(config).compile(rules, function(err, css) {
			if (err) {
				this.emit('error', new PluginError(PLUGIN_NAME, err.message, {
					showStack: true
				}));
				return;
			}
			outputFile.contents = new Buffer(css);
			this.emit('data', outputFile);
			this.emit('end');
		}.bind(this));
	}

	return through(bufferContents, endStream);
}

export = bundle;
