import Element = require('../Element');
import IRuleBody = require('./IRuleBody');
import Modifier = require('../Modifier');


interface IBlockBody extends IRuleBody {
	elements?: Element[];
	modifiers?: Modifier[];
}

export = IBlockBody;
