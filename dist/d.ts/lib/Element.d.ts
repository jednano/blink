import Configuration = require('./Configuration');
import ElementBody = require('./interfaces/ElementBody');
import Modifier = require('./Modifier');
declare class Element {
    public name: string;
    public body: ElementBody;
    public modifiers : Modifier[];
    constructor(name: string, body?: ElementBody);
    public resolve(base: string, config: Configuration): any[];
}
export = Element;
