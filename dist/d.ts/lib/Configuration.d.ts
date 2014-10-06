import ConfigurationForBrowser = require('./browser/Configuration');
import ConfigurationOptions = require('./interfaces/ConfigurationOptions');
declare class Configuration extends ConfigurationForBrowser implements ConfigurationOptions {
    constructor(options?: ConfigurationOptions);
    public loadPlugins(options?: ConfigurationOptions): any;
    private tryLoadingPlugin(pluginPath);
    public newline : string;
}
export = Configuration;
