import IHashTable = require('./IHashTable');
import MediaAtRule = require('../MediaAtRule');


interface IRuleBody extends IHashTable<any> {
	extend?: any[];
	include?: Function[];
	respond?: MediaAtRule[];
}

export = IRuleBody;
