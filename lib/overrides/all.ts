import IOverrides = require('../interfaces/IOverrides');
import boxSizing = require('./boxSizing');
import display = require('./display');
import font = require('./font');


// ReSharper disable once UnusedLocals
var overrides: IOverrides = {
	boxSizing: boxSizing,
	display: display,
	font: font
};

export = overrides;
