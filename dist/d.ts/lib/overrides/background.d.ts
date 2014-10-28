import BackgroundOptions = require('../interfaces/css/BackgroundOptions');
import Configuration = require('../Configuration');
declare function background(options?: BackgroundOptions): (config: Configuration) => string[][];
export = background;
