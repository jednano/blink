import Configuration = require('./browser/Configuration');
import MediaAtRule = require('./MediaAtRule');
import RuleBody = require('./interfaces/RuleBody');
declare class Rule {
    body: RuleBody;
    private config;
    private decs;
    responders: MediaAtRule[];
    private _selectors;
    selectors: any;
    constructor(selectors: any, body?: RuleBody);
    private splitSelectors(selectors);
    resolve(config: Configuration): any[][];
    private resolveTree(selectors, seed, key, body);
    private joinSelectors(left, right);
    clone(): Rule;
    private resolveOverride(key, value);
    private combineKeys(k1, k2);
    private isDeclarationValue(value);
    private compileDeclarationValue(value);
    private compileArray(arr);
    private compilePrimitive(value);
    compile(config: Configuration): string;
}
export = Rule;
