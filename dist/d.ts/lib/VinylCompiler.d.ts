/// <reference path="../../../bower_components/dt-vinyl/vinyl.d.ts" />
import File = require('vinyl');
import Configuration = require('./Configuration');
declare class VinylCompiler {
    private compiler;
    constructor(config?: Configuration);
    compile(file: File): File;
}
export = VinylCompiler;
