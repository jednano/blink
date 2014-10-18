import _BackgroundOptions = require('../interfaces/css/BackgroundOptions');
import _Block = require('../Block');
import _BlockBody = require('../interfaces/BlockBody');
import _Compiler = require('../Compiler');
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
declare function blink(contents: string, callback: blink.Callback, options?: blink.ConfigurationOptions): void;
declare function blink(rules: {}, callback: blink.Callback, options?: blink.ConfigurationOptions): void;
declare function blink(rule: blink.Rule, callback: blink.Callback, options?: blink.ConfigurationOptions): void;
declare function blink(rules: blink.Rule[], callback: blink.Callback, options?: blink.ConfigurationOptions): void;
declare function blink(block: blink.Block, callback: blink.Callback, options?: blink.ConfigurationOptions): void;
declare module blink {
    class Block extends _Block {
    }
    class Compiler extends _Compiler {
    }
    class Configuration extends _Configuration {
    }
    class Element extends _Element {
    }
    class MediaAtRule extends _MediaAtRule {
    }
    class Modifier extends _Modifier {
    }
    class Rule extends _Rule {
    }
    interface BackgroundOptions extends _BackgroundOptions {
    }
    interface BlockBody extends _BlockBody {
    }
    interface ConfigurationOptions extends _ConfigurationOptions {
    }
    interface ElementBody extends _ElementBody {
    }
    interface Extender extends _Extender {
    }
    interface ModifierBody extends _ModifierBody {
    }
    interface Override extends _Override {
    }
    interface RuleBody extends _RuleBody {
    }
    var config: Configuration;
    interface Callback {
        (err: Error, css?: string): void;
    }
}
export = blink;
