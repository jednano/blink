import File = require('vinyl');
import ConfigurationOptions = require('./interfaces/ConfigurationOptions');
declare function bundle(outputFilename: string, options?: ConfigurationOptions): NodeJS.ReadWriteStream;
declare function bundle(outputFile: File, options?: ConfigurationOptions): NodeJS.ReadWriteStream;
declare function bundle(output: {
    path: string;
}, options?: ConfigurationOptions): NodeJS.ReadWriteStream;
export = bundle;
