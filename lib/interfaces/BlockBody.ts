import Element = require('../Element');
import Modifier = require('../Modifier');
import RuleBody = require('./RuleBody');


interface BlockBody extends RuleBody {
	elements?: Element[];
	modifiers?: Modifier[];
}

export = BlockBody;
