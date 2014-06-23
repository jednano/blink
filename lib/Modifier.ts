import Configuration = require('./Configuration');
import Element = require('./Element');
import IModifierBody = require('./interfaces/IModifierBody');
import Rule = require('./Rule');


class Modifier {

	public get elements() {
		return this.body.elements || [];
	}

	public set elements(value: Element[]) {
		this.body.elements = value;
	}

	constructor(public name: string, public body?: IModifierBody) {
	}

	public resolve(base: string, config: Configuration) {
		var elements = this.elements;
		delete this.body.elements;
		var selector = base + config.modifier.replace('%s', this.name);
		var resolved = new Rule(selector, this.body).resolve(config);
		this.elements = elements;

		this.elements.forEach(element => {
			[].push.apply(resolved, element.resolve(selector, config));
		});

		return resolved;
	}

}

export = Modifier;
