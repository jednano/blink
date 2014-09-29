import Configuration = require('./Configuration');
import Element = require('./Element');
import ModifierBody = require('./interfaces/ModifierBody');
declare class Modifier {
    public name: string;
    public body: ModifierBody;
    public elements : Element[];
    constructor(name: string, body?: ModifierBody);
    public resolve(base: string, config: Configuration): any[];
}
export = Modifier;
