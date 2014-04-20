import IDeclarationTree = require('./IDeclarationTree');
import Element = require('../Element');
import Modifier = require('../Modifier');


interface IBlockDeclarations extends IDeclarationTree {
	elements?: Element[];
	modifiers?: Modifier[];
}

export = IBlockDeclarations;
