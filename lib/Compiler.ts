import fs = require('fs');
import path = require('path');

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
			var imported = require(path.resolve(filename));
			var compile: Function = (imported instanceof Array)
				? this.compileRules
				: this.compileRule;
			results.push({
				src: filename,
				dest: filename.replace(new RegExp(path.extname(filename) + '$'), '.css'),
				contents: compile.call(this, imported)
			});
		});
		return results;
	}

	compileRules(rules: Rule[]) {
		var css = this.compileExtenders(rules);
		rules.forEach(rule => {
			css += rule.compile(this.config);
		});
		return css;
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

	private compileRule(rule: Rule) {
		if (rule.extend) {
			Array.prototype.shift.apply(rule.include, rule.extend);
			delete rule.extend;
		}
		return rule.compile(this.config);
	}

}

export = Compiler;
