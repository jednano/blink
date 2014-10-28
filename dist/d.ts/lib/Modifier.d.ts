import Configuration = require('./Configuration');
import Element = require('./Element');
import ModifierBody = require('./interfaces/ModifierBody');
declare class Modifier {
    name: string;
    body: ModifierBody;
    elements: Element[];
    constructor(name: string, body?: ModifierBody);
    resolve(base: string, config: Configuration): any[][];
}
export = Modifier;
