import Configuration = require('./Configuration');
import HashTable = require('./interfaces/HashTable');
import RuleBody = require('./interfaces/RuleBody');
export declare class Block {
    name: string;
    body: BlockBody;
    elements: ElementsWithModifiers;
    modifiers: ModifiersWithElements;
    constructor(name: string, body?: BlockBody);
    resolve(config: Configuration): any[][];
}
export declare class Element {
    name: string;
    body: RuleBodyWithModifiers;
    modifiers: RuleBodyWithElements;
    constructor(name: string, body?: RuleBodyWithModifiers);
    resolve(base: string, config: Configuration): any[][];
}
export declare class Modifier {
    name: string;
    body: RuleBodyWithElementsWithModifiers;
    elements: RuleBodyWithModifiers;
    constructor(name: string, body?: RuleBodyWithElementsWithModifiers);
    resolve(base: string, config: Configuration): any[][];
}
export interface BlockBody extends RuleBodyWithElementsWithModifiers, RuleBodyWithModifiersWithElements {
}
export interface RuleBodyWithElementsWithModifiers extends RuleBody {
    elements?: ElementsWithModifiers;
}
export interface ElementsWithModifiers extends HashTable<RuleBodyWithModifiers> {
}
export interface RuleBodyWithModifiers extends RuleBody {
    modifiers?: Modifiers;
}
export interface Modifiers extends HashTable<RuleBody> {
}
export interface RuleBodyWithModifiersWithElements extends RuleBody {
    modifiers?: ModifiersWithElements;
}
export interface ModifiersWithElements extends HashTable<RuleBodyWithElements> {
}
export interface RuleBodyWithElements extends RuleBody {
    elements?: Elements;
}
export interface Elements extends HashTable<RuleBody> {
}
