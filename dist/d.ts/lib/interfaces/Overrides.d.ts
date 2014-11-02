import _appearance = require('../overrides/appearance');
import _background = require('../overrides/background');
import _box = require('../overrides/box');
import _boxSizing = require('../overrides/boxSizing');
import _clearfix = require('../overrides/clearfix');
import _display = require('../overrides/display');
import _fill = require('../overrides/fill');
import _opacity = require('../overrides/opacity');
import _text = require('../overrides/text');
import _textSizeAdjust = require('../overrides/textSizeAdjust');
interface Overrides {
    appearance: typeof _appearance;
    background: typeof _background;
    box: typeof _box;
    boxSizing: typeof _boxSizing;
    clearfix: typeof _clearfix;
    display: typeof _display;
    fill: typeof _fill;
    opacity: typeof _opacity;
    text: typeof _text;
    textSizeAdjust: typeof _textSizeAdjust;
}
export = Overrides;
