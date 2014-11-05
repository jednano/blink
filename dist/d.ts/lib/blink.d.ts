/// <reference path="../bower_components/dt-vinyl/vinyl.d.ts" />
import _BackgroundOptions = require('./interfaces/css/BackgroundOptions');
import _Compiler = require('./Compiler');
import _Configuration = require('./Configuration');
import _ConfigurationOptions = require('./interfaces/ConfigurationOptions');
import _Rule = require('./Rule');
import _RuleBody = require('./interfaces/RuleBody');
import BEM = require('./BEM');
declare function blink(options?: blink.ConfigurationOptions): NodeJS.ReadWriteStream;
declare module blink {
    class Block extends BEM.Block {
    }
    class Compiler extends _Compiler<Configuration> {
    }
    class Configuration extends _Configuration {
    }
    class Element extends BEM.Element {
    }
    class Modifier extends BEM.Modifier {
    }
    class Rule extends _Rule {
    }
    interface BackgroundOptions extends _BackgroundOptions {
    }
    interface ConfigurationOptions extends _ConfigurationOptions {
    }
    interface RuleBody extends _RuleBody {
    }
    var config: Configuration;
}
export = blink;
