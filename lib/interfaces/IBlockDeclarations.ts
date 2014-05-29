import Element = require('../Element');
import IRuleBody = require('./IRuleBody');
import Modifier = require('../Modifier');


interface IBlockDeclarations extends IRuleBody {
	elements?: Element[];
	modifiers?: Modifier[];
}

export = IBlockDeclarations;
