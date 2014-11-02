import Overrides = require('../interfaces/Overrides');
import background = require('./background');
import clearfix = require('./clearfix');
import fill = require('./fill');

// ReSharper disable once UnusedLocals
var overrides: Overrides = {
	background: background,
	clearfix: clearfix,
	fill: fill
};

export = overrides;
