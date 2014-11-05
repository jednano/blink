///<reference path="../bower_components/dt-vinyl/vinyl.d.ts" />
import File = require('vinyl');

import _BackgroundOptions = require('./interfaces/css/BackgroundOptions');
import _Compiler = require('./Compiler');
import _Configuration = require('./Configuration');
import _ConfigurationOptions = require('./interfaces/ConfigurationOptions');
import _Rule = require('./Rule');
import _RuleBody = require('./interfaces/RuleBody');
import BEM = require('./BEM');
import plugin = require('./plugin');

// ReSharper disable once UnusedLocals
function blink(options?: blink.ConfigurationOptions) {
	return plugin(options);
}

// ReSharper disable once InconsistentNaming
module blink {

	export class Block         extends BEM.Block {}
	export class Compiler      extends _Compiler<Configuration> {}
	export class Configuration extends _Configuration {}
	export class Element       extends BEM.Element {}
	export class Modifier      extends BEM.Modifier {}
	export class Rule          extends _Rule {}

	export interface BackgroundOptions    extends _BackgroundOptions {}
	export interface ConfigurationOptions extends _ConfigurationOptions {}
	export interface RuleBody             extends _RuleBody {}

	export var config = new Configuration();

}

export = blink;
