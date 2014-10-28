import Configuration = require('../Configuration');
declare function box(value: any): (config: Configuration) => any[];
export = box;
