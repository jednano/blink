///<reference path="../bower_components/dt-node/node.d.ts" />
import _IBlockDeclarations = require('./interfaces/IBlockDeclarations');
import _IElementDeclarations = require('./interfaces/IElementDeclarations');
import _IModifierDeclarations = require('./interfaces/IModifierDeclarations');
import _IDeclarationTree = require('./interfaces/IDeclarationTree');
import _Rule = require('./Rule');
import _Block = require('./Block');
import _Element = require('./Element');
import _Modifier = require('./Modifier');
import Configuration = require('./Configuration');


module Blink {

	export var configuration = new Configuration();

	export interface IDeclarationTree extends _IDeclarationTree {
	}

	export class Rule extends _Rule {
	}

	export class Block extends _Block {
	}

	export interface IBlockDeclarations extends _IBlockDeclarations {
	}

	export class Element extends _Element {
	}

	export interface IElementDeclarations extends _IElementDeclarations {
	}

	export class Modifier extends _Modifier {
	}

	export interface IModifierDeclarations extends _IModifierDeclarations {
	}

}

export = Blink;
