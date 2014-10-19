import Extender = require('../interfaces/Extender');
declare function inlineBlock(options?: inlineBlock.Options): Extender;
declare module inlineBlock {
    interface Options {
        verticalAlign?: string;
    }
}
export = inlineBlock;
