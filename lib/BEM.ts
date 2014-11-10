import Configuration = require('./Configuration');
import HashTable = require('./interfaces/HashTable');
import Rule = require('./Rule');
import RuleBody = require('./interfaces/RuleBody');

export class Block {

	get elements() {
		return this.body.elements;
	}

	set elements(value: ElementsWithModifiers) {
		this.body.elements = value;
	}

	get modifiers() {
		return this.body.modifiers;
	}

	set modifiers(value: ModifiersWithElements) {
		this.body.modifiers = value;
	}

	constructor(public name: string, public body?: BlockBody) {
	}

	resolve(config: Configuration) {
		var elements = this.elements;
		delete this.body.elements;
		var modifiers = this.modifiers;
		delete this.body.modifiers;
		var selector = config.block.replace('%s', this.name);
		var resolved = new Rule(selector, this.body).resolve(config);
		this.elements = elements;
		this.modifiers = modifiers;

		Object.keys(elements || {}).forEach(key => {
			var element = new Element(key, elements[key]);
			[].push.apply(resolved, element.resolve(selector, config));
		});
		Object.keys(modifiers || {}).forEach(key => {
			var modifier = new Modifier(key, modifiers[key]);
			[].push.apply(resolved, modifier.resolve(selector, config));
		});

		return resolved;
	}
}

export class Element {

	get modifiers() {
		return this.body.modifiers;
	}

	set modifiers(value: RuleBodyWithElements) {
		this.body.modifiers = value;
	}

	constructor(public name: string, public body?: RuleBodyWithModifiers) {
	}

	resolve(base: string, config: Configuration) {
		var modifiers = this.modifiers;
		delete this.body.modifiers;
		var selector = base + config.element.replace('%s', this.name);
		var resolved = new Rule(selector, this.body).resolve(config);
		this.modifiers = modifiers;

		Object.keys(modifiers || {}).forEach(key => {
			var modifier = new Modifier(key, modifiers[key]);
			[].push.apply(resolved, modifier.resolve(selector, config));
		});

		return resolved;
	}
}

export class Modifier {

	get elements() {
		return this.body.elements;
	}

	set elements(value: RuleBodyWithModifiers) {
		this.body.elements = value;
	}

	constructor(public name: string, public body?: RuleBodyWithElementsWithModifiers) {
	}

	resolve(base: string, config: Configuration) {
		var elements = this.elements;
		delete this.body.elements;
		var selector = base + config.modifier.replace('%s', this.name);
		var resolved = new Rule(selector, this.body).resolve(config);
		this.elements = elements;

		Object.keys(elements || {}).forEach(key => {
			var element = new Element(key, elements[key]);
			[].push.apply(resolved, element.resolve(selector, config));
		});

		return resolved;
	}

}

// ReSharper disable once InconsistentNaming
export interface
	BlockBody
extends
	RuleBodyWithElementsWithModifiers,
	RuleBodyWithModifiersWithElements {
}

export interface RuleBodyWithElementsWithModifiers extends RuleBody {
	elements?: ElementsWithModifiers;
}

export interface ElementsWithModifiers extends HashTable<RuleBodyWithModifiers> { }

export interface RuleBodyWithModifiers extends RuleBody {
	modifiers?: Modifiers;
}

export interface Modifiers extends HashTable<RuleBody> { }

export interface RuleBodyWithModifiersWithElements extends RuleBody {
	modifiers?: ModifiersWithElements;
}

export interface ModifiersWithElements extends HashTable<RuleBodyWithElements> { }

export interface RuleBodyWithElements extends RuleBody {
	elements?: Elements;
}

export interface Elements extends HashTable<RuleBody> { }
