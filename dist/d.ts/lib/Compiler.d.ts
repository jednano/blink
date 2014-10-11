import CompilerForBrowser = require('./browser/Compiler');
import Configuration = require('./Configuration');
declare class Compiler extends CompilerForBrowser {
    public config: Configuration;
    constructor(config?: Configuration);
    public compile(): NodeJS.ReadWriteStream;
    private renameExtToCss(file);
    private compileBuffer(data, filepath, callback);
}
export = Compiler;
