import BackgroundOptions = require('../interfaces/css/BackgroundOptions');
import HashTable = require('./HashTable');
interface RuleBody extends HashTable<any> {
    respond?: HashTable<RuleBody>;
    /**
     * A shorthand for setting the individual background values in a single
     * place in the style sheet.
     *
     * The background CSS shorthand property assigns explicit given values and
     * sets missing properties to their initial values.
     */
    background?: BackgroundOptions;
    clearfix?: boolean;
}
export = RuleBody;
