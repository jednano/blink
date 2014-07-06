import background = require('../overrides/background');
import boxSizing = require('../overrides/boxSizing');
import clearfix = require('../overrides/clearfix');
import display = require('../overrides/display');
import font = require('../overrides/font');


interface IOverrides {
	background: typeof background;
	boxSizing: typeof boxSizing;
	clearfix: typeof clearfix;
	display: typeof display;
	font: typeof font;
}

export = IOverrides;
