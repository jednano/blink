import IHashTable = require('./IHashTable');


interface IRuleBody extends IHashTable<any> {
	extend?: any[];
	include?: Function[];
}

export = IRuleBody;
