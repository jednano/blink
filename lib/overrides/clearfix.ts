import Extender = require('../interfaces/Extender');
import noop = require('../extenders/noop');
import Override = require('../interfaces/Override');

// ReSharper disable once UnusedLocals
function clearfix(value: boolean) {

	if (!value) {
		return noop();
	}

	var override = <Override>(() => [
		['content', ''],
		['display', 'table'],
		['clear', 'both']
	]);

	override.args = arguments;
	override.selectors = [':after'];

	return override;

}

export = clearfix;
