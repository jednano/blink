import _BackgroundOptions = require('../interfaces/css/BackgroundOptions');
import _BrowserConfiguration = require('./Configuration');
import _Compiler = require('../Compiler');
import _ConfigurationOptions = require('../interfaces/ConfigurationOptions');
import _Rule = require('../Rule');
import _RuleBody = require('../interfaces/RuleBody');
import BEM = require('../BEM');
declare function blink(contents: string, config?: blink.Configuration): string;
declare function blink(rule: blink.Rule, config?: blink.Configuration): string;
declare function blink(rules: blink.Rule[], config?: blink.Configuration): string;
declare function blink(rules: {}[], config?: blink.Configuration): string;
declare function blink(block: BEM.Block, config?: blink.Configuration): string;
declare function blink(rules: {}, config?: blink.Configuration): string;
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
}
export = blink;
