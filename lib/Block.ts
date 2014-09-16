import BlockBody = require('./interfaces/BlockBody');
import Configuration = require('./Configuration');
import Element = require('./Element');
import Modifier = require('./Modifier');
import Rule = require('./Rule');


class Block {

	public get elements() {
		return this.body.elements || [];
	}

	public set elements(value: Element[]) {
		this.body.elements = value;
	}

	public get modifiers() {
		return this.body.modifiers || [];
	}

	public set modifiers(value: Modifier[]) {
		this.body.modifiers = value;
	}

	constructor(public name: string, public body?: BlockBody) {
	}

	public resolve(config: Configuration) {
		var elements = this.elements;
		delete this.body.elements;
		var modifiers = this.modifiers;
		delete this.body.modifiers;
		var selector = config.block.replace('%s', this.name);
		var resolved = new Rule(selector, this.body).resolve(config);
		this.elements = elements;
		this.modifiers = modifiers;

		elements.forEach(element => {
			[].push.apply(resolved, element.resolve(selector, config));
		});
		modifiers.forEach(modifier => {
			[].push.apply(resolved, modifier.resolve(selector, config));
		});

		return resolved;
	}
}

export = Block;
