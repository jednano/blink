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
    public resolve(rule: Rule): any[];
    public resolve(rules: Rule[]): any[];
    private resolveRules(rules);
    private format(rules);
    private resolveResponders(responders);
    private registerResponders(registry, selectors, responders);
    private resolveTree(tree);
}
export = Compiler;
