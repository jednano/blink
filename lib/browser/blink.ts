import _BackgroundOptions = require('../interfaces/css/BackgroundOptions');
import _Block = require('../Block');
import _BlockBody = require('../interfaces/BlockBody');
import _Compiler = require('./Compiler');
import _Configuration = require('./Configuration');
import _ConfigurationOptions = require('../interfaces/ConfigurationOptions');
import _Element = require('../Element');
import _ElementBody = require('../interfaces/ElementBody');
import _Extender = require('../interfaces/Extender');
import _MediaAtRule = require('../MediaAtRule');
import _Modifier = require('../Modifier');
import _ModifierBody = require('../interfaces/ModifierBody');
import _Override = require('../interfaces/Override');
import _Rule = require('../Rule');
import _RuleBody = require('../interfaces/RuleBody');

// ReSharper disable once UnusedLocals
function blink(contents: string, callback: blink.Callback, options?: blink.ConfigurationOptions): void;
function blink(rules: {}, callback: blink.Callback, options?: blink.ConfigurationOptions): void;
function blink(rule: blink.Rule, callback: blink.Callback, options?: blink.ConfigurationOptions): void;
function blink(rules: blink.Rule[], callback: blink.Callback, options?: blink.ConfigurationOptions): void;
function blink(block: blink.Block, callback: blink.Callback, options?: blink.ConfigurationOptions): void;
function blink(contents: any, callback: blink.Callback, options?: blink.ConfigurationOptions) {
	var compiler = new blink.Compiler(new blink.Configuration(options || {}));
	compiler.compile(contents, callback);
}

// ReSharper disable once InconsistentNaming
module blink {

	export class Block         extends _Block {}
	export class Compiler      extends _Compiler {}
	export class Configuration extends _Configuration {}
	export class Element       extends _Element {}
	export class MediaAtRule   extends _MediaAtRule {}
	export class Modifier      extends _Modifier {}
	export class Rule          extends _Rule {}

	export interface BackgroundOptions    extends _BackgroundOptions {}
	export interface BlockBody            extends _BlockBody {}
	export interface ConfigurationOptions extends _ConfigurationOptions {}
	export interface ElementBody          extends _ElementBody {}
	export interface Extender             extends _Extender {}
	export interface ModifierBody         extends _ModifierBody {}
	export interface Override             extends _Override {}
	export interface RuleBody             extends _RuleBody {}

	export var config = new Configuration();
	export interface Callback {
		(err: Error, css?: string): void;
	}

}

export = blink;
