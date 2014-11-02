import ConfigurationOptions = require('../interfaces/ConfigurationOptions');
import Overrides = require('../interfaces/Overrides');
declare class Configuration implements ConfigurationOptions {
    constructor(options?: ConfigurationOptions);
    clone(): Configuration;
    set(options: ConfigurationOptions): Configuration;
    raw: ConfigurationOptions;
    toString(): string;
    /**
     * The location of the config file
     */
    config: string;
    quiet: boolean;
    trace: boolean;
    force: boolean;
    boring: boolean;
    style: string;
    oneIndent: any;
    newline: string;
    quote: string;
    oneSpace: string;
    declarationSeparator: string;
    ruleSeparator: any;
    block: string;
    element: string;
    modifier: string;
    overrides: Overrides;
}
export = Configuration;
