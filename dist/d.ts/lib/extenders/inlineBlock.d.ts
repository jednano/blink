import Configuration = require('../Configuration');
declare function inlineBlock(options?: inlineBlock.Options): (config: Configuration) => any[];
declare module inlineBlock {
    interface Options {
        verticalAlign?: string;
    }
}
export = inlineBlock;
