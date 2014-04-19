///<reference path="../bower_components/dt-node/node.d.ts" />
import _IDeclarationTree = require('./interfaces/IDeclarationTree');
import _Rule = require('./Rule');
import Configuration = require('./Configuration');


module Blink {

	export var configuration = new Configuration();

	export interface IDeclarationTree extends _IDeclarationTree {
	}

	export class Rule extends _Rule {
	}

}

export = Blink;
