import HashTable = require('./HashTable');
import MediaAtRule = require('../MediaAtRule');
import BackgroundOptions = require('../interfaces/css/BackgroundOptions');


interface RuleBody extends HashTable<any> {
	respond?: MediaAtRule[];

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
