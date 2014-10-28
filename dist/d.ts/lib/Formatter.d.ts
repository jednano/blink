import Configuration = require('./browser/Configuration');
declare class Formatter {
    private config;
    format(config: Configuration, rules: any[][]): string;
    private formatRules(rules, level);
    private formatRule(rule, level);
    private joinSelectors(selectors);
    private formatBody(body, level);
    private isDeclarationValue(value);
    private formatDeclarations(decs, level);
}
export = Formatter;
