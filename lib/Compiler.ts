﻿var mod = require('module');
import path = require('path');
import stream = require('stream');
var stripBOM = require('strip-bom');

import a = require('./helpers/array');
import Configuration = require('./Configuration');
import ExtenderRegistry = require('./ExtenderRegistry');
import ICompiledResult = require('./interfaces/ICompiledResult');
import IConfigurationOptions = require('./interfaces/IConfigurationOptions');
import IHashTable = require('./interfaces/IHashTable');
import Rule = require('./Rule');


class Compiler {

	constructor(public config?: Configuration) {
		this.config = config || new Configuration();
	}

	compile(sources: any[],
		callback: (err: Error, result: ICompiledResult) => void) {

		sources = sources || [];

		sources.forEach(source => {
			if (typeof source === 'string') {
				this.tryCompileFile(source, callback);
			}
			if (source instanceof stream.Readable) {
				this.tryCompileStream(source, callback);
			}
			callback(new Error('Unsupported source input'), {
				src: source
			});
		});
	}

	private tryCompileFile(filename: string, callback: Function) {
		var ext = new RegExp('\\.' + path.extname(filename).substr(1) + '$');
		var result: ICompiledResult = {
			src: filename,
			dest: filename.replace(ext, '.css')
		};
		try {
			var imported = require(path.resolve(filename));
			result.contents = this.compileRules(a.flatten([imported]));
			callback(null, result);
		} catch (err) {
			callback(err, result);
		}
	}

	compileRules(rules: Rule[]) {
		var chunks = [];
		push(this.compileExtenders(rules));
		rules.forEach(rule => {
			push(rule.compile(this.config));
		});
		function push(css) {
			if (css) {
				chunks.push(css);
			}
		}
		return chunks.join(this.config.ruleSeparator);
	}

	private compileExtenders(rules: Rule[]) {
		var extenders = new ExtenderRegistry();
		rules.forEach(rule => {
			(rule.extend || []).forEach(extender => {
				if (!extender.length) {
					extender = extender();
				}
				extenders.add(extender[1], extender[0], rule.selectors);
			});
		});
		return extenders.map((extender, selectors) => {
			var rule = new Rule(selectors, { include: [extender] });
			return rule.compile(this.config);
		}).join(this.config.newline);
	}

	private tryCompileStream(stream: stream.Readable, callback: Function) {
		try {
			this.readStream(contents => {
				callback(null, {
					contents: this.compileRules([this.compileModule(contents)])
				});
			});
		} catch (err) {
			callback(err);
		}
	}

	private readStream(callback: (contents: string) => void) {
		var contents = '';
		process.stdin.setEncoding('utf8');
		process.stdin.on('readable', () => {
			contents += (<any>process.stdin).read() || '';
		});
		process.stdin.on('end', () => {
			callback(stripBOM(contents));
		});
	}

	private compileModule(contents: string) {
		var m = new mod();
		m._compile(contents);
		return m.exports;
	}

}

export = Compiler;
