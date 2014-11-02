import Configuration = require('../Configuration');
declare function display(value: string, options?: {
    verticalAlign?: string;
}): (config: Configuration) => any;
export = display;
