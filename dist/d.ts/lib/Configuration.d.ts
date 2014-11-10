/// <reference path="../../../bower_components/dt-node/node.d.ts" />
import ConfigurationForBrowser = require('./browser/Configuration');
import ConfigurationOptions = require('./interfaces/ConfigurationOptions');
declare class Configuration extends ConfigurationForBrowser implements ConfigurationOptions {
    constructor(options?: ConfigurationOptions);
    loadPlugins(options?: ConfigurationOptions): any;
    private tryLoadingPlugin(pluginPath);
    newline: string;
}
export = Configuration;
