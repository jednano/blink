///<reference path="../bower_components/dt-vinyl/vinyl.d.ts" />
import File = require('vinyl');

import _BackgroundOptions = require('./interfaces/css/BackgroundOptions');
import _Compiler = require('./Compiler');
import _Configuration = require('./Configuration');
import _ConfigurationOptions = require('./interfaces/ConfigurationOptions');
import _plugin = require('./plugin');
import _Rule = require('./Rule');
import _RuleBody = require('./interfaces/RuleBody');
import _VinylCompiler = require('./VinylCompiler');
import BEM = require('./BEM');

// ReSharper disable once UnusedLocals
function blink(contents: string, config?: blink.Configuration): string;
function blink(file: File, config?: blink.Configuration): File;
function blink(rules: blink.Rule[], config?: blink.Configuration): string;
function blink(rules: {}[], config?: blink.Configuration): string;
function blink(rule: blink.Rule, config?: blink.Configuration): string;
function blink(block: BEM.Block, config?: blink.Configuration): string;
function blink(rules: {}, config?: blink.Configuration): string;
function blink(rules: any, config?: blink.Configuration): any {
	if (rules instanceof File) {
		return new blink.VinylCompiler(config).compile(rules);
	}
	return new blink.Compiler(config).compile(rules);
}

// ReSharper disable once InconsistentNaming
module blink {

	export class Block         extends BEM.Block {}
	export class Compiler      extends _Compiler<Configuration> {}
	export class Configuration extends _Configuration {}
	export class Element       extends BEM.Element {}
	export class Modifier      extends BEM.Modifier {}
	export class Rule          extends _Rule {}
	export class VinylCompiler extends _VinylCompiler {}

	export interface BackgroundOptions    extends _BackgroundOptions {}
	export interface ConfigurationOptions extends _ConfigurationOptions {}
	export interface RuleBody             extends _RuleBody {}

	export var config = new Configuration();
	export var plugin = _plugin;

}

export = blink;
