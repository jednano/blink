import IDeclarationTree = require('./IDeclarationTree');
import Modifier = require('../Modifier');


interface IModifierDeclarations extends IDeclarationTree {
	modifiers?: Modifier[];
}

export = IModifierDeclarations;
