import Configuration = require('../Configuration');
declare function experimental(property: string, value: any, options?: {
    official?: boolean;
    webkit?: boolean;
    khtml?: boolean;
    moz?: boolean;
    ms?: boolean;
    o?: boolean;
}): (config: Configuration) => any[];
export = experimental;
