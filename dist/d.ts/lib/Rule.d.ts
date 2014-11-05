import Configuration = require('./browser/Configuration');
import HashTable = require('./interfaces/HashTable');
import RuleBody = require('./interfaces/RuleBody');
declare class Rule {
    body: RuleBody;
    private config;
    private decs;
    responders: HashTable<RuleBody>;
    private _selectors;
    selectors: any;
    private splitSelectors(selectors);
    constructor(selectors: string[], body?: RuleBody);
    constructor(selectors: string, body?: RuleBody);
    resolve(config: Configuration): any[][];
    clone(): Rule;
    private resolveTree(selectors, body, seed?, key?);
    private resolveResponders(selectors, body, seed);
    private joinSelectors(left, right);
    private combineKeys(k1, k2);
    private resolveOverride(overrideKey, selectors, seed, value);
    private isDeclarationValue(value);
    private compileDeclarationValue(value);
    private compileArray(arr);
    private compilePrimitive(value);
    compile(config: Configuration): string;
}
export = Rule;
