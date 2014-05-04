import fs = require('fs');
import path = require('path');

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

	compile(files: string[],
		callback: (err: Error, results?: ICompiledResult[]) => void) {
		callback(null, this.compileFiles(files));
	}

	private compileFiles(files: string[]) {
		var results: ICompiledResult[] = [];
		files.forEach(filename => {
			var ext = new RegExp('\\.' + path.extname(filename).substr(1) + '$');
			var imported = require(path.resolve(filename).replace(ext, ''));
			results.push({
				src: filename,
				dest: filename.replace(ext, '.css'),
				contents: this.compileRules(a.flatten([imported]))
			});
		});
		return results;
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
		return chunks.join(this.config.newline);
	}

	private compileExtenders(rules: Rule[]) {
		var extenders = new ExtenderRegistry();
		rules.forEach(rule => {
			if (!rule.extend) {
				return;
			}
			rule.extend.forEach(extender => {
				extenders.add(extender, rule.selectors);
			});
		});
		return extenders.map((extender, selectors) => {
			var rule = new Rule(selectors, { include: [extender] });
			return rule.compile(this.config);
		}).join(this.config.newline);
	}

}

export = Compiler;
