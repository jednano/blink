import IHashTable = require('./IHashTable');


interface IDeclarationTree extends IHashTable<any> {
	include?: Function[];
}

export = IDeclarationTree;
