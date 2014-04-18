import CompileSettings = require('./CompileSettings');
import DeclarationTree = require('./DeclarationTree');
import IDeclarationTree = require('./interfaces/IDeclarationTree');
import os = require('os');


class Rule {

	public declarations: DeclarationTree;

	constructor(public selectors: string[], declarations?: IDeclarationTree) {
		this.declarations = new DeclarationTree(declarations || {});
	}

	public compile(settings?: CompileSettings) {
		settings = settings || new CompileSettings();
		var space = settings.oneSpace;
		return this.selectors.join(',' + space) + space + '{' + settings.newline +
			this.declarations.compile(settings) + '}' + settings.newline;
	}
}

export = Rule;
