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
declare module Blink {
    class Compiler extends _Compiler {
    }
    class Configuration extends _Configuration {
    }
    class Rule extends _Rule {
    }
    class Block extends _Block {
    }
    class Element extends _Element {
    }
    class MediaAtRule extends _MediaAtRule {
    }
    class Modifier extends _Modifier {
    }
    interface CompileCallback {
        (err: Error, css?: string): void;
    }
    interface ConfigurationOptions extends _ConfigurationOptions {
    }
    interface BlockBody extends _BlockBody {
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
    function compile(contents: string, callback: CompileCallback, options?: ConfigurationOptions): void;
    function compile(rule: Rule, callback: CompileCallback, options?: ConfigurationOptions): void;
    function compile(rules: Rule[], callback: CompileCallback, options?: ConfigurationOptions): void;
    function compile(block: Block, callback: CompileCallback, options?: ConfigurationOptions): void;
    function compile(blocks: Block[], callback: CompileCallback, options?: ConfigurationOptions): void;
}
export = Blink;
