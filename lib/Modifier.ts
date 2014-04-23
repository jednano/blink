import IModifierDeclarations = require('./interfaces/IModifierDeclarations');
import Configuration = require('./Configuration');
import Element = require('./Element');
import Rule = require('./Rule');


class Modifier {

	public elements: Element[];

	constructor(public name: string, private declarations: IModifierDeclarations) {
		this.elements = declarations.elements || [];
		delete declarations.elements;
	}

	public compile(selector: string, config: Configuration) {
		selector += config.modifierFormat.replace('%s', this.name);
		var rules = [new Rule([selector], this.declarations).compile(config)];
		rules.push.apply(rules, this.elements.map(element => {
			return element.compile(selector, config);
		}));
		return rules.join(config.newline);
	}
}

export = Modifier;
