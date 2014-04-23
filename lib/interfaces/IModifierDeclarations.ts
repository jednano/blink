import IDeclarationTree = require('./IDeclarationTree');
import Element = require('../Element');


interface IModifierDeclarations extends IDeclarationTree {
	elements?: Element[];
}

export = IModifierDeclarations;
