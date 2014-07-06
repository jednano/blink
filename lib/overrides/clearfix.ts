import _clearfix = require('../extenders/clearfix');
import noop = require('../extenders/noop');
import IExtender = require('../interfaces/IExtender');
import IOverride = require('../interfaces/IOverride');

// ReSharper disable once UnusedLocals
function clearfix(value: boolean) {
	return value ? _clearfix() : noop();
}

export = clearfix;
