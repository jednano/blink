import Configuration = require('./browser/Configuration');
declare class Formatter {
    private config;
    public format(config: Configuration, rules: any[][]): string;
    private formatRules(rules, level);
    private formatRule(rule, level);
    private formatBody(body, level);
    private isDeclarationValue(value);
    private formatDeclarations(decs, level);
    private formatValue(value);
}
export = Formatter;
