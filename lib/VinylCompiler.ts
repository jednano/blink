/// <reference path="../bower_components/dt-vinyl/vinyl.d.ts" />
import File = require('vinyl');
var mod = require('module');
import path = require('path');

import Compiler = require('./Compiler');
import Configuration = require('./Configuration');

class VinylCompiler {

	private compiler: Compiler<Configuration>;

	constructor(config?: Configuration) {
		this.compiler = new Compiler(config);
	}

	compile(file: File) {
		var css = this.compiler.compile(compileModule(file));
		var result = file.clone({ contents: false });
		result.contents = new Buffer(css);
		result.path = renameExtToCss(result);
		return result;
	}

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

export = VinylCompiler;
