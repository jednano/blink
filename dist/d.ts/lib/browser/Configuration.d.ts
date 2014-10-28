import ConfigurationOptions = require('../interfaces/ConfigurationOptions');
import Extenders = require('../interfaces/Extenders');
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
    chrome: number;
    firefox: number;
    ie: number;
    opera: number;
    safari: number;
    android: number;
    firefoxMobile: number;
    ieMobile: number;
    operaMobile: number;
    safariMobile: number;
    webkitPrefix: boolean;
    khtmlPrefix: boolean;
    mozPrefix: boolean;
    msPrefix: boolean;
    oPrefix: boolean;
    extenders: Extenders;
    overrides: Overrides;
}
export = Configuration;
