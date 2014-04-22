import Configuration = require('./Configuration');
import Rule = require('./Rule');


export function compileRules(config: Configuration, ...rules: Rule[]) {
	var helpers = new Map();
	var registry = [];
	rules.forEach(rule => {
		if (!rule.extend) {
			return;
		}
		rule.extend.forEach(helper => {
			if (!~registry.indexOf(helper)) {
				registry.push(helper);
			}
			var selectors = <string[]>helpers.get(helper) || [];
			selectors.push.apply(selectors, rule.selectors);
			helpers.set(helper, selectors);
		});
	});
	return registry.map((helper: Function) => {
		var selectors = <string[]>helpers.get(helper);
		var rule = new Rule(selectors, { include: [helper] });
		return rule.compile(config);
	}).join(config.newline);
}
