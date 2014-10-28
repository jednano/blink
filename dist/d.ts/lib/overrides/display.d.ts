import Configuration = require('../Configuration');
import inlineBlock = require('../extenders/inlineBlock');
declare function display(value: string, options?: inlineBlock.Options): (config: Configuration) => any[];
export = display;
