///<reference path="../bower_components/dt-gulp-util/gulp-util.d.ts" />
import File = require('vinyl');
import gutil = require('gulp-util');
var mod = require('module');
import path = require('path');
import through = require('through2');

import Compiler = require('./Compiler');
import Configuration = require('./Configuration');
import ConfigurationOptions = require('./interfaces/ConfigurationOptions');

var PLUGIN_NAME = 'blink';
var PluginError = gutil.PluginError;

// ReSharper disable once UnusedLocals
function plugin(options?: ConfigurationOptions): NodeJS.ReadWriteStream {

	return through.obj((file: File, enc: string, cb: Function) => {

		if (file.isNull()) {
			cb(null, file);
			return;
		}

		if (file.isStream()) {
			cb(new PluginError(PLUGIN_NAME, 'Streaming not supported'));
			return;
		}

		var rule;
		try {
			rule = compileModule(file);
		} catch (err) {
			cb(new PluginError(PLUGIN_NAME, err.message, {
				showStack: true
			}));
			return;
		}

		var config = new Configuration(options);
		new Compiler(config).compile(rule, (err2, css) => {
			if (err2) {
				cb(new PluginError(PLUGIN_NAME, err2.message, {
					showStack: true
				}));
				return;
			}
			file.contents = new Buffer(css);
			file.path = renameExtToCss(file);
			cb(null, file);
		});

	});
}

function compileModule(file: File) {
	var m = new mod();
	m.paths = mod._nodeModulePaths(path.dirname(file.path));
	m._compile(file.contents.toString());
	return m.exports;
}

function renameExtToCss(file: File) {
	var dir = path.dirname(file.path);
	var basename = path.basename(file.path, path.extname(file.path));
	return path.join(dir, basename + '.css');
}

export = plugin;
