import Extender = require('../interfaces/Extender');
declare function experimental(property: string, value: any, options?: {
    official?: boolean;
    webkit?: boolean;
    khtml?: boolean;
    moz?: boolean;
    ms?: boolean;
    o?: boolean;
}): Extender;
export = experimental;
