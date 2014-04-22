///<reference path="../bower_components/dt-node/node.d.ts" />
import _Block = require('./Block');
import _Element = require('./Element');
import _helpers = require('./helpers');
import _IBlockDeclarations = require('./interfaces/IBlockDeclarations');
import _IBrowserSupportOptions = require('./interfaces/IBrowserSupportOptions');
import _IDeclarationTree = require('./interfaces/IDeclarationTree');
import _IElementDeclarations = require('./interfaces/IElementDeclarations');
import _IModifierDeclarations = require('./interfaces/IModifierDeclarations');
import _Modifier = require('./Modifier');
import _Rule = require('./Rule');
import Configuration = require('./Configuration');


module Blink {

	export var configuration = new Configuration();

	export interface IBrowserSupportOptions extends _IBrowserSupportOptions {
	}

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

	export var helpers = _helpers;

}

export = Blink;
