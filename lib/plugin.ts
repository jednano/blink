///<reference path="../bower_components/dt-gulp-util/gulp-util.d.ts" />
import File = require('vinyl');
import gutil = require('gulp-util');
import through = require('through2');

import Configuration = require('./Configuration');
import ConfigurationOptions = require('./interfaces/ConfigurationOptions');
import VinylCompiler = require('./VinylCompiler');

var PLUGIN_NAME = 'blink';
var PluginError = gutil.PluginError;

function plugin(options?: ConfigurationOptions): NodeJS.ReadWriteStream {

	var compiler = new VinylCompiler(new Configuration(options));

	return through.obj((file: File, enc: string, cb: Function) => {

		if (file.isNull()) {
			cb(null, file);
			return;
		}

		if (file.isStream()) {
			cb(new PluginError(PLUGIN_NAME, 'Streaming not supported'));
			return;
		}

		try {
			cb(null, compiler.compile(file));
		} catch (err) {
			cb(new PluginError(PLUGIN_NAME, err.message, {
				showStack: true
			}));
		}

	});

}

export = plugin;
