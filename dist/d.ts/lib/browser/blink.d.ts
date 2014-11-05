import _BackgroundOptions = require('../interfaces/css/BackgroundOptions');
import _BrowserConfiguration = require('./Configuration');
import _Compiler = require('../Compiler');
import _ConfigurationOptions = require('../interfaces/ConfigurationOptions');
import _Rule = require('../Rule');
import _RuleBody = require('../interfaces/RuleBody');
import BEM = require('../BEM');
declare function blink(contents: string, callback: blink.Callback, options?: blink.ConfigurationOptions): void;
declare function blink(rules: {}, callback: blink.Callback, options?: blink.ConfigurationOptions): void;
declare function blink(rule: blink.Rule, callback: blink.Callback, options?: blink.ConfigurationOptions): void;
declare function blink(rules: blink.Rule[], callback: blink.Callback, options?: blink.ConfigurationOptions): void;
declare function blink(block: blink.Block, callback: blink.Callback, options?: blink.ConfigurationOptions): void;
declare module blink {
    class Block extends BEM.Block {
    }
    class Compiler extends _Compiler<Configuration> {
    }
    class Configuration extends _BrowserConfiguration {
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
    interface Callback {
        (err: Error, css?: string): void;
    }
}
export = blink;
