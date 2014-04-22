import Configuration = require('./Configuration');
import DeclarationTree = require('./DeclarationTree');
import IRuleDeclarations = require('./interfaces/IRuleDeclarations');
import DeclarationCompiler = require('./DeclarationCompiler');


class Rule {

	private declarations: DeclarationTree;
	public extend: Function[];
	private include: Function[];
	private declarationCompiler = new DeclarationCompiler();

	constructor(public selectors: string[], declarations?: IRuleDeclarations) {
		this.include = declarations.include || [];
		delete declarations.include;
		this.extend = declarations.extend || [];
		delete declarations.extend;
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
		return this.include.map(helper => {
			var declarations;
			if (helper.prototype.constructor.name === '') {
				declarations = helper(config);
			} else {
				declarations = helper()(config);
			}
			return this.declarationCompiler.compile(config, declarations);
		}).join(config.newline);
	}

}

export = Rule;
