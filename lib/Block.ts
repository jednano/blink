import IBlockDeclarations = require('./interfaces/IBlockDeclarations');
import Configuration = require('./Configuration');
import Element = require('./Element');
import Modifier = require('./Modifier');
import Rule = require('./Rule');


class Block {

	public elements: Element[];
	public modifiers: Modifier[];

	constructor(public name: string, private declarations: IBlockDeclarations) {
		this.elements = declarations.elements || [];
		delete declarations.elements;
		this.modifiers = declarations.modifiers || [];
		delete declarations.modifiers;
	}

	public compile(config: Configuration) {
		var selector = config.block.replace('%s', this.name);
		var rules = [new Rule([selector], this.declarations).compile(config)];
		rules.push.apply(rules, this.elements.map(element => {
			return element.compile(selector, config);
		}));
		rules.push.apply(rules, this.modifiers.map(modifier => {
			return modifier.compile(selector, config);
		}));
		return rules.join(config.newline);
	}
}

export = Block;
