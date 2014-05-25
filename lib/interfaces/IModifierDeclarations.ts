import Element = require('../Element');
import IRuleBody = require('./IRuleBody');


interface IModifierDeclarations extends IRuleBody {
	elements?: Element[];
}

export = IModifierDeclarations;
