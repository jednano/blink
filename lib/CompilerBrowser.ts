import a = require('./helpers/array');
import Configuration = require('./Configuration');
import ExtenderRegistry = require('./ExtenderRegistry');
import Formatter = require('./Formatter');
import MediaAtRule = require('./MediaAtRule');
import Rule = require('./Rule');
import s = require('./helpers/string');


class CompilerBrowser {

	constructor(public config?: Configuration) {
		this.config = config || new Configuration();
	}

	public compile(contents: string,
		callback: (err: Error, css?: string) => void) {
		try {
			var exports = eval(contents);
		} catch (err) {
			callback(err);
			return;
		}
		var rules = a.flatten([exports]);
		this.compileRules(rules, callback);
	}

	public compileRules(rules: Rule[],
		callback: (err: Error, css?: string) => void) {

		try {
			var resolved = this.resolveRules(rules);
			var formatted = new Formatter().format(this.config, resolved);
			callback(null, formatted);
		} catch (err) {
			callback(err);
		}
	}

	public resolveRules(rules: Rule[]) {
		var resolved = [];

		this.resolveExtenders(rules).forEach(extended => {
			if (typeof extended[0] !== 'undefined') {
				resolved.push(extended[0]);
			}
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
			var body: any = {};
			if (extender.selectors) {
				extender.selectors.forEach(selector => {
					body[selector] = { include: [extender] };
				});
			} else {
				body.include = [extender];
			}
			var r = new Rule(selectors, body);
			return r.resolve(this.config);
		});
	}

	private registerExtenders(extenders: ExtenderRegistry, rules: Rule[]) {
		if (!rules) {
			return;
		}
		rules.forEach(rule => {
			(rule.extenders || []).forEach(extender => {
				if (!extender.hasOwnProperty('args')) {
					extender = extender();
				}
				extenders.add(extender, rule.selectors);
			});
			var overrides = this.config.overrides;
			var body = rule.body;
			Object.keys(body).forEach(property => {
				var override = overrides[s.camelize(property)];
				if (override) {
					override = override(body[property]);
					extenders.add(override, rule.selectors);
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

export = CompilerBrowser;
