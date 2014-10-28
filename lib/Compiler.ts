/* jshint evil: true */
/* tslint:disable:no-eval */
import a = require('./helpers/array');
import blink = require('./blink');
import Block = require('./Block');
import Configuration = require('./browser/Configuration');
import Formatter = require('./Formatter');
import MediaAtRule = require('./MediaAtRule');
import o = require('./helpers/object');
import Rule = require('./Rule');
import s = require('./helpers/string');

class Compiler<T extends Configuration> {

	constructor(public config: T) {
	}

	public compile(contents: string, callback: { (err: Error, css?: string): void; }): void;
	public compile(rules: {}, callback: { (err: Error, css?: string): void; }): void;
	public compile(rules: {}[], callback: { (err: Error, css?: string): void; }): void;
	public compile(rule: Rule, callback: { (err: Error, css?: string): void; }): void;
	public compile(rules: Rule[], callback: { (err: Error, css?: string): void; }): void;
	public compile(block: Block, callback: { (err: Error, css?: string): void; }): void;
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
		var resolved = [];

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
			if (Array.isArray(value)) {
				result.push([[key], value]);
				return;
			}
			result.push([[key], this.resolveTree(value)]);
		});
		return result;
	}

}

export = Compiler;
