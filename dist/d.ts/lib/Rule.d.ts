import Configuration = require('./browser/Configuration');
import MediaAtRule = require('./MediaAtRule');
import RuleBody = require('./interfaces/RuleBody');
declare class Rule {
    public body: RuleBody;
    private config;
    private decs;
    public responders : MediaAtRule[];
    private _selectors;
    public selectors : any;
    constructor(selectors: any, body?: RuleBody);
    private splitSelectors(selectors);
    public resolve(config: Configuration): any[];
    private joinSelectors(left, right);
    public clone(): Rule;
    private resolveBody(seed, key, body);
    private resolveOverride(key, value);
    private combineKeys(k1, k2);
    private isDeclarationValue(value);
    private compileDeclarationValue(value);
    private compileArray(arr);
    private compilePrimitive(value);
    public compile(config: Configuration): string;
}
export = Rule;
