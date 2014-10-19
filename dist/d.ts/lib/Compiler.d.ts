import Block = require('./Block');
import Configuration = require('./browser/Configuration');
import Rule = require('./Rule');
declare class Compiler {
    public config: Configuration;
    constructor(config?: Configuration);
    public compile(contents: string, callback: (err: Error, css?: string) => void): void;
    public compile(rules: {}, callback: (err: Error, css?: string) => void): void;
    public compile(rules: {}[], callback: (err: Error, css?: string) => void): void;
    public compile(rule: Rule, callback: (err: Error, css?: string) => void): void;
    public compile(rules: Rule[], callback: (err: Error, css?: string) => void): void;
    public compile(block: Block, callback: (err: Error, css?: string) => void): void;
    private compileRules(rules, callback);
    public resolveRules(rules: Rule[]): any[];
    private format(rules);
    private resolveExtenders(rules);
    private registerExtenders(extenders, rules);
    private resolveResponders(responders);
    private registerResponders(registry, selectors, responders);
    private resolveTree(tree);
}
export = Compiler;
