import IRuleBody = require('./IRuleBody');
import Modifier = require('../Modifier');


interface IElementDeclarations extends IRuleBody {
	modifiers?: Modifier[];
}

export = IElementDeclarations;
