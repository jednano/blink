import ConfigurationForBrowser = require('./browser/Configuration');
import ConfigurationOptions = require('./interfaces/ConfigurationOptions');
declare class Configuration extends ConfigurationForBrowser implements ConfigurationOptions {
    constructor(options?: ConfigurationOptions);
    public loadPlugins(options?: ConfigurationOptions): any;
    private tryLoadingPlugin(pluginPath);
    public registerFunctions(configProperty: string, folder: string): any;
    private loadConfig(filename);
    public newline : string;
}
export = Configuration;
