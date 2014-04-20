import IDeclarationTree = require('./IDeclarationTree');


interface IRuleDeclarations extends IDeclarationTree {
	includes?: Function[];
}

export = IRuleDeclarations;
