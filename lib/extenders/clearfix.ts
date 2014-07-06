import IExtender = require('../interfaces/IExtender');

// ReSharper disable once UnusedLocals
function clearfix() {

	var extender = <IExtender>(() => [
		['content', ''],
		['display', 'table'],
		['clear', 'both']
	]);

	extender.args = arguments;
	extender.selectors = [':after'];

	return extender;

}

export = clearfix;
