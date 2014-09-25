import background = require('../overrides/background');
import box = require('../overrides/box');
import boxSizing = require('../overrides/boxSizing');
import clearfix = require('../overrides/clearfix');
import display = require('../overrides/display');
import font = require('../overrides/font');
import text = require('../overrides/text');
import textSizeAdjust = require('../overrides/textSizeAdjust');


interface Overrides {
	background: typeof background;
	box: typeof box;
	boxSizing: typeof boxSizing;
	clearfix: typeof clearfix;
	display: typeof display;
	font: typeof font;
	text: typeof text;
	textSizeAdjust: typeof textSizeAdjust;
}

export = Overrides;
