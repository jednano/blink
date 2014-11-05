/* jshint evil: true */
/* tslint:disable:no-eval */
import a = require('./helpers/array');
import BEM = require('./BEM');
import blink = require('./blink');
import Configuration = require('./browser/Configuration');
import Formatter = require('./Formatter');
import HashTable = require('./interfaces/HashTable');
import o = require('./helpers/object');
import Rule = require('./Rule');
import RuleBody = require('./interfaces/RuleBody');
import s = require('./helpers/string');

class Compiler<T extends Configuration> {

	constructor(public config: T) {
	}

	public compile(contents: string, callback: { (err: Error, css?: string): void; }): void;
	public compile(rules: {}, callback: { (err: Error, css?: string): void; }): void;
	public compile(rules: {}[], callback: { (err: Error, css?: string): void; }): void;
	public compile(rule: Rule, callback: { (err: Error, css?: string): void; }): void;
	public compile(rules: Rule[], callback: { (err: Error, css?: string): void; }): void;
	public compile(block: BEM.Block, callback: { (err: Error, css?: string): void; }): void;
	public compile(rules: any, callback: { (err: Error, css?: string): void; }) {
		if (typeof rules === 'string') {
			try {
				rules = eval(rules);
			} catch (err) {
				callback(err);
				return;
			}
		}
		rules = a.flatten([rules]).map(rule => {
			if (o.isPlainObject(rule)) {
				return createRulesFromObject(rule);
			}
			return rule;
		});
		this.compileRules(a.flatten(rules), callback);

		function createRulesFromObject(obj) {
			return Object.keys(obj).map(selectors => {
				return new Rule(selectors, obj[selectors]);
			});
		}
	}

	private compileRules(rules: Rule[],
		callback: (err: Error, css?: string) => void) {

		var formatted: string;
		try {
			var resolved = this.resolve(rules);
			formatted = this.format(resolved);
		} catch (err) {
			callback(err);
			return;
		}
		callback(null, formatted);
	}

	private resolve(rules: Rule[]) {
		return rules.map(rule => {
			return rule.resolve(this.config)[0];
		});
	}

	private format(rules: any[][]) {
		return new Formatter().format(this.config, rules);
	}

}

export = Compiler;
