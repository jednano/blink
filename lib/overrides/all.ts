import Overrides = require('../interfaces/Overrides');
import appearance = require('./appearance');
import background = require('./background');
import box = require('./box');
import boxSizing = require('./boxSizing');
import clearfix = require('./clearfix');
import display = require('./display');
import font = require('./font');
import opacity = require('./opacity');
import text = require('./text');
import textSizeAdjust = require('./textSizeAdjust');


// ReSharper disable once UnusedLocals
var overrides: Overrides = {
	appearance: appearance,
	background: background,
	box: box,
	boxSizing: boxSizing,
	clearfix: clearfix,
	display: display,
	font: font,
	opacity: opacity,
	text: text,
	textSizeAdjust: textSizeAdjust
};

export = overrides;
