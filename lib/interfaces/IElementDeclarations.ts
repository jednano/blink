import IDeclarationTree = require('./IDeclarationTree');
import Modifier = require('../Modifier');


interface IElementDeclarations extends IDeclarationTree {
	modifiers?: Modifier[];
}

export = IElementDeclarations;
