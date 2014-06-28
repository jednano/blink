import IOverrides = require('../interfaces/IOverrides');
import boxSizing = require('./boxSizing');
import display = require('./display');


// ReSharper disable once UnusedLocals
var overrides: IOverrides = {
	boxSizing: boxSizing,
	display: display
};

export = overrides;
