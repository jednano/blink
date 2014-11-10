/* jshint evil: true */
import a = require('./helpers/array');
import BEM = require('./BEM');
import Configuration = require('./browser/Configuration');
import Formatter = require('./Formatter');
import o = require('./helpers/object');
import Rule = require('./Rule');

class Compiler<T extends Configuration> {

	constructor(public config: T) {
	}

	compile(contents: string): string;
	compile(rules: Rule[]): string;
	compile(rules: {}[]): string;
	compile(rule: Rule): string;
	compile(block: BEM.Block): string;
	compile(rules: {}): string;
	compile(rules: any): string {
		function createRulesFromObject(rule: any) {
			return Object.keys(rule).map(selectors => {
				return new Rule(selectors, rule[selectors]);
			});
		}
		if (typeof rules === 'string') {
			/* tslint:disable:no-eval */
			rules = eval(rules);
		}
		rules = a.flatten([rules]).map(rule => {
			if (o.isPlainObject(rule)) {
				return createRulesFromObject(rule);
			}
			return rule;
		});
		return this.compileRules(a.flatten(rules));
	}

	private compileRules(rules: Rule[]) {
		return this.format(this.resolve(rules));
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
