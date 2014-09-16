import Configuration = require('./Configuration');
import ElementBody = require('./interfaces/ElementBody');
import Modifier = require('./Modifier');
import Rule = require('./Rule');


class Element {

	public get modifiers() {
		return this.body.modifiers || [];
	}

	public set modifiers(value: Modifier[]) {
		this.body.modifiers = value;
	}

	constructor(public name: string, public body?: ElementBody) {
	}

	public resolve(base: string, config: Configuration) {
		var modifiers = this.modifiers;
		delete this.body.modifiers;
		var selector = base + config.element.replace('%s', this.name);
		var resolved = new Rule(selector, this.body).resolve(config);
		this.modifiers = modifiers;

		modifiers.forEach(modifier => {
			[].push.apply(resolved, modifier.resolve(selector, config));
		});

		return resolved;
	}
}

export = Element;
