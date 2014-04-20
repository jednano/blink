import Configuration = require('./Configuration');
import DeclarationTree = require('./DeclarationTree');
import IDeclarationTree = require('./interfaces/IDeclarationTree');


class Rule {

	public declarations: DeclarationTree;

	constructor(public selectors: string[], declarations?: IDeclarationTree) {
		this.declarations = new DeclarationTree(declarations || {});
	}

	public compile(config: Configuration) {
		var space = config.oneSpace;
		return this.selectors.join(',' + space) + space + '{' + config.newline +
			this.declarations.compile(config) + '}' + config.newline;
	}
}

export = Rule;
