import IElementDeclarations = require('./interfaces/IElementDeclarations');
import Configuration = require('./Configuration');
import Modifier = require('./Modifier');
import Rule = require('./Rule');


class Element {

	public modifiers: Modifier[];

	constructor(public name: string, private declarations: IElementDeclarations) {
		this.modifiers = declarations.modifiers || [];
		delete declarations.modifiers;
	}

	public compile(selector: string, config: Configuration) {
		selector += config.element.replace('%s', this.name);
		var rules = [new Rule([selector], this.declarations).compile(config)];
		rules.push.apply(rules, this.modifiers.map(modifier => {
			return modifier.compile(selector, config);
		}));
		return rules.join(config.newline);
	}
}

export = Element;
