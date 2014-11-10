import BEM = require('./BEM');
import Configuration = require('./browser/Configuration');
import Rule = require('./Rule');
declare class Compiler<T extends Configuration> {
    config: T;
    constructor(config: T);
    compile(contents: string): string;
    compile(rules: Rule[]): string;
    compile(rules: {}[]): string;
    compile(rule: Rule): string;
    compile(block: BEM.Block): string;
    compile(rules: {}): string;
    private compileRules(rules);
    private resolve(rules);
    private format(rules);
}
export = Compiler;
