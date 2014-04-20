import Configuration = require('./Configuration');
import DeclarationTree = require('./DeclarationTree');
import IRuleDeclarations = require('./interfaces/IRuleDeclarations');


class Rule {

	private declarations: DeclarationTree;
	private includes: Function[];

	constructor(public selectors: string[], declarations?: IRuleDeclarations) {
		this.includes = declarations.includes || [];
		delete declarations.includes;
		this.declarations = new DeclarationTree(declarations || {});
	}

	public compile(config: Configuration) {
		var space = config.oneSpace;
		var css = this.selectors.join(',' + space) + space + '{' + config.newline;
		css += this.compileIncludes(config);
		css += this.declarations.compile(config) + '}' + config.newline;
		return css;
	}

	private compileIncludes(config: Configuration) {
		return this.includes.map(helper => {
			return new DeclarationTree(helper()).compile(config);
		}).join(config.newline);
	}
}

export = Rule;
