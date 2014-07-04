import fs = require('fs');
var mod = require('module');
import path = require('path');
import _stream = require('stream');
var stripBOM = require('strip-bom');

import a = require('./helpers/array');
import Configuration = require('./Configuration');
import ExtenderRegistry = require('./ExtenderRegistry');
import Formatter = require('./Formatter');
import IConfigurationOptions = require('./interfaces/IConfigurationOptions');
import IFile = require('./interfaces/IFile');
import IFiles = require('./interfaces/IFiles');
import IHashTable = require('./interfaces/IHashTable');
import MediaAtRule = require('./MediaAtRule');
import Rule = require('./Rule');
import s = require('./helpers/string');


class Compiler {

	constructor(public config?: Configuration) {
		this.config = config || new Configuration();
	}

	public compile(files: IFiles, callback: (err: Error, file?: IFile) => void) {

		if (!files) {
			return;
		}

		if (!files.src) {
			callback(new Error('Missing `src` property'));
			return;
		}

		if (!files.dest) {
			callback(new Error('Missing `dest` property'));
			return;
		}

		files.src.forEach(src => {
			this.compileFile({ src: src, dest: files.dest }, callback);
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

	private compileFile(file: IFile, callback: (err: Error, file?: IFile) => void) {
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
				src: (<any>stream).path,
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
			var compiled = this.compileModule(
				stripBOM(file.contents),
				path.dirname(file.src)
			);
			callback(null, {
				src: file.src,
				dest: this.renameExtToCss(file),
				contents: this.compileRules(compiled instanceof Array ?
					compiled : [compiled])
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

	public compileRules(rules: Rule[]) {
		return new Formatter().format(this.config, this.resolveRules(rules));
	}

	public resolveRules(rules: Rule[]) {
		var resolved = [];

		this.resolveExtenders(rules).forEach(extended => {
			resolved.push(extended[0]);
		});
		rules.forEach(rule => {
			push(rule.resolve(this.config));
		});
		push(this.resolveResponders(rules));

		function push(val) {
			if (val && val.length) {
				resolved.push(val[0]);
			}
		}

		return resolved;
	}

	private format(rules: any[][]) {
		return new Formatter().format(this.config, rules);
	}

	private resolveExtenders(rules: Rule[]) {
		var extenders = new ExtenderRegistry();
		this.registerExtenders(extenders, rules);
		return extenders.map((extender, selectors) => {
			var r = new Rule(selectors, { include: [extender] });
			return r.resolve(this.config);
		});
	}

	private registerExtenders(extenders: ExtenderRegistry, rules: Rule[]) {
		if (!rules) {
			return;
		}
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
				var override = overrides[s.camelize(property)];
				if (override) {
					override = override(body[property]);
					extenders.add(override[1], override[0], rule.selectors);
					delete body[property];
				}
			});
		});
	}

	private resolveResponders(responders: Rule[]) {
		var registry: any = {};
		responders.forEach(responder => {
			this.registerResponders(registry, responder.selectors, responder.responders);
		});
		return this.resolveTree(registry);
	}

	private registerResponders(registry: {}, selectors: string[],
		responders: MediaAtRule[]) {

		(responders || []).forEach(responder => {
			var condition = responder.condition;
			var scope = registry[condition] = registry[condition] || {};
			responder.selectors = selectors;
			scope.__extended = scope.__extended || new ExtenderRegistry();
			this.registerExtenders(scope.__extended, responders);
			var resolved = responder.resolve(this.config);
			if (resolved.length) {
				resolved = resolved[0];
				scope[resolved[0].join(',' + this.config.oneSpace)] = resolved[1];
			}
			this.registerResponders(scope, selectors, responder.responders);
		});
	}

	private resolveTree(tree: any): any[][] {
		var result = [];
		Object.keys(tree).forEach(key => {
			var value = tree[key];
			if (value instanceof ExtenderRegistry) {
				value.forEach((extender, selectors) => {
					var r = new Rule(selectors, { include: [extender] });
					result.push(r.resolve(this.config)[0]);
				});
				delete tree[key];
			}
		});
		Object.keys(tree).forEach(key => {
			var value = tree[key];
			if (value instanceof Array) {
				result.push([[key], value]);
			} else if (value) {
				result.push([[key], this.resolveTree(value)]);
			}
		});
		return result;
	}

}

export = Compiler;
