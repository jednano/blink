import HashTable = require('./HashTable');
import MediaAtRule = require('../MediaAtRule');
import BackgroundOptions = require('../interfaces/css/BackgroundOptions');


interface RuleBody extends HashTable<any> {
	respond?: MediaAtRule[];
	background?: BackgroundOptions;
	clearfix?: boolean;
}

export = RuleBody;
