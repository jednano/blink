import BlockBody = require('./interfaces/BlockBody');
import Configuration = require('./Configuration');
import Element = require('./Element');
import Modifier = require('./Modifier');
declare class Block {
    name: string;
    body: BlockBody;
    elements: Element[];
    modifiers: Modifier[];
    constructor(name: string, body?: BlockBody);
    resolve(config: Configuration): any[][];
}
export = Block;
