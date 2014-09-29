import Modifier = require('../Modifier');
import RuleBody = require('./RuleBody');
interface ElementBody extends RuleBody {
    modifiers?: Modifier[];
}
export = ElementBody;
