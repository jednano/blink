import BlockBody = require('./interfaces/BlockBody');
import Configuration = require('./Configuration');
import Element = require('./Element');
import Modifier = require('./Modifier');
declare class Block {
    public name: string;
    public body: BlockBody;
    public elements : Element[];
    public modifiers : Modifier[];
    constructor(name: string, body?: BlockBody);
    public resolve(config: Configuration): any[];
}
export = Block;
