import Extender = require('../interfaces/Extender');

// ReSharper disable once UnusedLocals
function clearfix() {

	var extender = <Extender>(() => [
		['content', ''],
		['display', 'table'],
		['clear', 'both']
	]);

	extender.args = arguments;
	extender.selectors = [':after'];

	return extender;

}

export = clearfix;
