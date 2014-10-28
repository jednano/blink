import Configuration = require('../Configuration');
import Override = require('../interfaces/Override');
import s = require('../helpers/string');

// ReSharper disable once UnusedLocals
function clearfix(value: boolean) {

	var override = <Override>((config: Configuration) => {
		if (!value) {
			// ReSharper disable once InconsistentFunctionReturns
			return;
		}
		return [
			['content', s.repeat(config.quote, 2)],
			['display', 'table'],
			['clear', 'both']
		];
	});

	override.selectors = [':after'];

	return override;

}

export = clearfix;
