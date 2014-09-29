import Extender = require('./interfaces/Extender');
declare class ExtenderRegistry {
    private extenders;
    private selectors;
    public add(extender: Extender, selectors: string[]): void;
    private createKey(extender);
    public forEach(callback: (extender: Extender, selectors: string[]) => void): void;
    public map(callback: (extender: Extender, selectors: string[]) => void): any[];
}
export = ExtenderRegistry;
