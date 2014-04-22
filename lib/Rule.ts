import compilers = require('./compilers');
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
			var declarations;
			if (helper.prototype.constructor.name === '') {
				declarations = helper(config);
			} else {
				declarations = helper()(config);
			}
			return compilers.compileDeclarations(config, declarations);
		}).join(config.newline);
	}
}

export = Rule;
