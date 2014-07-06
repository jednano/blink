import IOverrides = require('../interfaces/IOverrides');
import background = require('./background');
import boxSizing = require('./boxSizing');
import clearfix = require('./clearfix');
import display = require('./display');
import font = require('./font');


// ReSharper disable once UnusedLocals
var overrides: IOverrides = {
	background: background,
	boxSizing: boxSizing,
	clearfix: clearfix,
	display: display,
	font: font
};

export = overrides;
