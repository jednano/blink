import IRuleBody = require('./IRuleBody');
import Modifier = require('../Modifier');


interface IElementBody extends IRuleBody {
	modifiers?: Modifier[];
}

export = IElementBody;
