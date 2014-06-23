import Element = require('../Element');
import IRuleBody = require('./IRuleBody');


interface IModifierBody extends IRuleBody {
	elements?: Element[];
}

export = IModifierBody;
