import blink = require('./blink');
import Block = require('../Block');
import Configuration = require('./Configuration');
import Rule = require('../Rule');
declare class Compiler {
    public config: Configuration;
    constructor(config?: Configuration);
    public compile(contents: string, callback: blink.Callback): void;
    public compile(rules: {}, callback: blink.Callback): void;
    public compile(rules: {}[], callback: blink.Callback): void;
    public compile(rule: Rule, callback: blink.Callback): void;
    public compile(rules: Rule[], callback: blink.Callback): void;
    public compile(block: Block, callback: blink.Callback): void;
    public compileRules(rules: Rule[], callback: (err: Error, css?: string) => void): void;
    public resolveRules(rules: Rule[]): any[];
    private format(rules);
    private resolveExtenders(rules);
    private registerExtenders(extenders, rules);
    private resolveResponders(responders);
    private registerResponders(registry, selectors, responders);
    private resolveTree(tree);
}
export = Compiler;
