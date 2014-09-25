import Overrides = require('../interfaces/Overrides');
import background = require('./background');
import box = require('./box');
import boxSizing = require('./boxSizing');
import clearfix = require('./clearfix');
import display = require('./display');
import font = require('./font');
import text = require('./text');
import textSizeAdjust = require('./textSizeAdjust');


// ReSharper disable once UnusedLocals
var overrides: Overrides = {
	background: background,
	box: box,
	boxSizing: boxSizing,
	clearfix: clearfix,
	display: display,
	font: font,
	text: text,
	textSizeAdjust: textSizeAdjust
};

export = overrides;
