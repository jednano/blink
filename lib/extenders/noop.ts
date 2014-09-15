import Extender = require('../interfaces/Extender');

// ReSharper disable once UnusedLocals
function noop() {
	var extender = <Extender>(() => []);
	extender.args = arguments;
	return extender;
}

export = noop;
