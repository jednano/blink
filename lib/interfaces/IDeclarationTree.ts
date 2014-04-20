import IHashTable = require('./IHashTable');


interface IDeclarationTree extends IHashTable<any> {
	includes?: Function[];
}

export = IDeclarationTree;
