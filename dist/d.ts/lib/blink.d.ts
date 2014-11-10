/// <reference path="../../../bower_components/dt-vinyl/vinyl.d.ts" />
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
declare function blink(contents: string, config?: blink.Configuration): string;
declare function blink(file: File, config?: blink.Configuration): File;
declare function blink(rules: blink.Rule[], config?: blink.Configuration): string;
declare function blink(rules: {}[], config?: blink.Configuration): string;
declare function blink(rule: blink.Rule, config?: blink.Configuration): string;
declare function blink(block: BEM.Block, config?: blink.Configuration): string;
declare function blink(rules: {}, config?: blink.Configuration): string;
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
    class VinylCompiler extends _VinylCompiler {
    }
    interface BackgroundOptions extends _BackgroundOptions {
    }
    interface ConfigurationOptions extends _ConfigurationOptions {
    }
    interface RuleBody extends _RuleBody {
    }
    var config: Configuration;
    var plugin: typeof _plugin;
}
export = blink;
