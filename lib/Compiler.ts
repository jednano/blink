import fs = require('fs');
var mod = require('module');
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
				this.compileFile(source, callback);
				return;
			}
			if (source instanceof stream.Readable) {
				this.compileStream(source, (err, css) => {
					callback(err, { contents: css });
				});
				return;
			}
			callback(new Error('Unsupported source input'), {
				src: source
			});
		});
	}

	private compileFile(filename: string, callback: Function) {
		var ext = new RegExp('\\.' + path.extname(filename).substr(1) + '$');
		var result: ICompiledResult = {
			src: filename,
			dest: filename.replace(ext, '.css')
		};
		var stream = <stream.Readable>fs.createReadStream(path.resolve(filename));
		this.compileStream(stream, (err, css) => {
			if (!err) {
				result.contents = css;
			}
			callback(err, result);
		});
	}

	private compileStream(stream: stream.Readable,
		callback: (err: Error, css?: string) => void) {
		this.readStream(stream, (err, contents) => {
			if (err) {
				callback(err);
				return;
			}
			this.tryCompileRules(contents, callback);
		});
	}

	private readStream(stream: stream.Readable,
		callback: (err: Error, contents?: string) => void) {
		var contents = '';
		stream.setEncoding('utf8');
		stream.on('readable', () => {
			contents += (<any>stream).read() || '';
		});
		stream.on('error', (err: Error) => {
			callback(err);
		});
		stream.on('end', () => {
			callback(null, contents);
		});
	}

	private tryCompileRules(contents: string,
		callback: (err: Error, css?: string) => void) {
		try {
			callback(null, this.compileRules([
				this.compileModule(stripBOM(contents))
			]));
		} catch (err) {
			callback(err);
		}
	}

	private compileModule(contents: string) {
		var m = new mod();
		m._compile(contents);
		return m.exports;
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

}

export = Compiler;
