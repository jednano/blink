import _BackgroundOptions = require('../interfaces/css/BackgroundOptions');
import _BrowserConfiguration = require('./Configuration');
import _Compiler = require('../Compiler');
import _ConfigurationOptions = require('../interfaces/ConfigurationOptions');
import _Rule = require('../Rule');
import _RuleBody = require('../interfaces/RuleBody');
import BEM = require('../BEM');

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

	export class Block         extends BEM.Block {}
	export class Compiler      extends _Compiler<Configuration> {}
	export class Configuration extends _BrowserConfiguration {}
	export class Element       extends BEM.Element {}
	export class Modifier      extends BEM.Modifier {}
	export class Rule          extends _Rule {}

	export interface BackgroundOptions    extends _BackgroundOptions {}
	export interface ConfigurationOptions extends _ConfigurationOptions {}
	export interface RuleBody             extends _RuleBody {}

	export var config = new Configuration();
	export interface Callback {
		(err: Error, css?: string): void;
	}

}

export = blink;
