import Block = require('./Block');
import Configuration = require('./browser/Configuration');
import Rule = require('./Rule');
declare class Compiler<T extends Configuration> {
    config: T;
    constructor(config: T);
    compile(contents: string, callback: (err: Error, css?: string) => void): void;
    compile(rules: {}, callback: (err: Error, css?: string) => void): void;
    compile(rules: {}[], callback: (err: Error, css?: string) => void): void;
    compile(rule: Rule, callback: (err: Error, css?: string) => void): void;
    compile(rules: Rule[], callback: (err: Error, css?: string) => void): void;
    compile(block: Block, callback: (err: Error, css?: string) => void): void;
    private compileRules(rules, callback);
    private resolve(rules);
    private format(rules);
    private resolveResponders(responders);
    private registerResponders(registry, selectors, responders);
    private resolveTree(tree);
}
export = Compiler;
