import Configuration = require('./Configuration');
import ElementBody = require('./interfaces/ElementBody');
import Modifier = require('./Modifier');
declare class Element {
    name: string;
    body: ElementBody;
    modifiers: Modifier[];
    constructor(name: string, body?: ElementBody);
    resolve(base: string, config: Configuration): any[][];
}
export = Element;
