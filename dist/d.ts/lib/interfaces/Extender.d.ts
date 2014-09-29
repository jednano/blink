import Configuration = require('../Configuration');
interface Extender {
    args: IArguments;
    selectors?: string[];
    (config?: Configuration): any[][];
}
export = Extender;
