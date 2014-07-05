import IOverrides = require('../interfaces/IOverrides');
import background = require('./background');
import boxSizing = require('./boxSizing');
import display = require('./display');
import font = require('./font');


// ReSharper disable once UnusedLocals
var overrides: IOverrides = {
	background: background,
	boxSizing: boxSizing,
	display: display,
	font: font
};

export = overrides;
