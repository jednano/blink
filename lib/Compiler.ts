import fs = require('fs');
var mod = require('module');
import path = require('path');
import _stream = require('stream');
var stripBOM = require('strip-bom');

import a = require('./helpers/array');
import Configuration = require('./Configuration');
import ExtenderRegistry = require('./ExtenderRegistry');
import IConfigurationOptions = require('./interfaces/IConfigurationOptions');
import IFile = require('./interfaces/IFile');
import IHashTable = require('./interfaces/IHashTable');
import Rule = require('./Rule');


class Compiler {

	constructor(public config?: Configuration) {
		this.config = config || new Configuration();
	}

	public compile(sources: any[], callback: (err: Error, file?: IFile) => void) {

		(sources || []).forEach(source => {
			if (typeof source === 'string') {
				this.compileFile({ src: source, dest: path.dirname(source) }, callback);
				return;
			}
			if (source.src && source.src instanceof Array) {
				source.src.forEach(src => {
					this.compileFile({ src: src, dest: source.dest }, callback);
				});
				return;
			}
			if (source instanceof _stream.Readable) {
				this.compileStream(source, callback);
				return;
			}
			if (source instanceof Rule) {
				this.tryCompileRule(source, (err, contents) => {
					callback(err, { contents: contents });
				});
				return;
			}
			callback(new Error('Unsupported source input'), {
				src: source
			});
		});
	}

	private tryCompileRule(rule: Rule,
		callback: (err: Error, contents?: string) => void) {
		try {
			callback(null, this.compileRules([rule]));
		} catch (err) {
			callback(err);
		}
	}

	private compileFile(file: IFile, callback: Function) {
		var stream = fs.createReadStream(path.resolve(file.src));
		this.compileStream(stream, (err, compiled) => {
			if (!err) {
				callback(err, compiled);
				return;
			}
			file.dest = this.renameExtToCss(file);
			callback(err, file);
		});
	}

	public compileStream(stream: NodeJS.ReadableStream,
		callback: (err: Error, file?: IFile) => void) {

		this.readStream(stream, (err, contents) => {
			if (err) {
				callback(err);
				return;
			}
			this.tryCompileContents({
				src: stream['path'],
				contents: contents
			}, callback);
		});
	}

	private readStream(stream: NodeJS.ReadableStream,
		callback: (err: Error, contents?: string) => void) {
		var contents = '';
		stream.setEncoding('utf8');
		stream.on('readable', () => {
			contents += stream.read() || '';
		});
		stream.on('error', (err: Error) => {
			callback(err);
		});
		stream.on('end', () => {
			callback(null, contents);
		});
	}

	public tryCompileContents(file: IFile,
		callback: (err: Error, file?: IFile) => void) {

		try {
			callback(null, {
				src: file.src,
				dest: this.renameExtToCss(file),
				contents: this.compileRules([
					this.compileModule(stripBOM(file.contents), path.dirname(file.src))
				])
			});
		} catch (err) {
			callback(err);
		}
	}

	private renameExtToCss(file: IFile) {
		if (!file.dest && file.src) {
			var ext = new RegExp('\\.' + path.extname(file.src).substr(1) + '$');
			return path.join(path.dirname(file.src),
				path.basename(file.src).replace(ext, '.css'));
		}
		return file.dest;
	}

	private compileModule(contents: string, folder: string) {
		var m = new mod();
		m.paths = mod._nodeModulePaths(folder);
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
			(rule.extenders || []).forEach(extender => {
				if (!extender.length) {
					extender = extender();
				}
				extenders.add(extender[1], extender[0], rule.selectors);
			});
			var overrides = this.config.overrides;
			var body = rule.body;
			Object.keys(body).forEach(property => {
				var override = overrides[property];
				if (override) {
					override = override(body[property]);
					extenders.add(override[1], override[0], rule.selectors);
					delete body[property];
				}
			});
		});
		return extenders.map((extender, selectors) => {
			var r = new Rule(selectors, { include: [extender] });
			return r.compile(this.config);
		}).join(this.config.newline);
	}

}

export = Compiler;
