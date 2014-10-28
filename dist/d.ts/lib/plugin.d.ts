/// <reference path="../bower_components/dt-gulp-util/gulp-util.d.ts" />
import ConfigurationOptions = require('./interfaces/ConfigurationOptions');
declare function plugin(options?: ConfigurationOptions): NodeJS.ReadWriteStream;
export = plugin;
