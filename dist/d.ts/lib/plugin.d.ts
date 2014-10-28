import ConfigurationOptions = require('./interfaces/ConfigurationOptions');
declare function plugin(options?: ConfigurationOptions): NodeJS.ReadWriteStream;
export = plugin;
