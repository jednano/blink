import _clearfix = require('../extenders/clearfix');
import noop = require('../extenders/noop');
import Extender = require('../interfaces/Extender');
import Override = require('../interfaces/Override');

// ReSharper disable once UnusedLocals
function clearfix(value: boolean) {
	return value ? _clearfix() : noop();
}

export = clearfix;
