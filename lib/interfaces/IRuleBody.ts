import IHashTable = require('./IHashTable');


interface IRuleBody extends IHashTable<any> {
	extend?: Function[];
	include?: Function[];
}

export = IRuleBody;
