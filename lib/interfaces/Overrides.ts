import appearance = require('../overrides/appearance');
import background = require('../overrides/background');
import box = require('../overrides/box');
import boxSizing = require('../overrides/boxSizing');
import clearfix = require('../overrides/clearfix');
import display = require('../overrides/display');
import font = require('../overrides/font');
import opacity = require('../overrides/opacity');
import text = require('../overrides/text');
import textSizeAdjust = require('../overrides/textSizeAdjust');


interface Overrides {
	appearance: typeof appearance;
	background: typeof background;
	box: typeof box;
	boxSizing: typeof boxSizing;
	clearfix: typeof clearfix;
	display: typeof display;
	font: typeof font;
	opacity: typeof opacity;
	text: typeof text;
	textSizeAdjust: typeof textSizeAdjust;
}

export = Overrides;
