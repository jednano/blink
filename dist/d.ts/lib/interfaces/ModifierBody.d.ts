import Element = require('../Element');
import RuleBody = require('./RuleBody');
interface ModifierBody extends RuleBody {
    elements?: Element[];
}
export = ModifierBody;
