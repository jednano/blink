import IDeclarationTree = require('./IDeclarationTree');


interface IRuleDeclarations extends IDeclarationTree {
	extend?: Function[];
}

export = IRuleDeclarations;
