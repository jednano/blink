import Extender = require('../interfaces/Extender');
declare function background(options?: {
    color?: string;
    image?: string;
    repeat?: string;
    attachment?: string;
    position?: any;
}): Extender;
export = background;
