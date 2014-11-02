import _background = require('../overrides/background');
import _clearfix = require('../overrides/clearfix');
import _fill = require('../overrides/fill');
interface Overrides {
    background: typeof _background;
    clearfix: typeof _clearfix;
    fill: typeof _fill;
}
export = Overrides;
