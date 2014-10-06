import CompilerForBrowser = require('./browser/Compiler');
import ConfigurationForBrowser = require('./browser/Configuration');
declare class Compiler extends CompilerForBrowser {
    public config: ConfigurationForBrowser;
    constructor(config?: ConfigurationForBrowser);
    public compile(): NodeJS.ReadWriteStream;
    private renameExtToCss(file);
    private compileBuffer(data, filepath, callback);
}
export = Compiler;
