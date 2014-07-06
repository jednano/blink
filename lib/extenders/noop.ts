import IExtender = require('../interfaces/IExtender');

// ReSharper disable once UnusedLocals
function noop() {
	var extender = <IExtender>(() => []);
	extender.args = arguments;
	return extender;
}

export = noop;
