import Configuration = require('../Configuration');
import s = require('../helpers/string');

// ReSharper disable once UnusedLocals
function clearfix(value: boolean) {

	return (config: Configuration) => {
		if (!value) {
			return {};
		}
		return {
			':after': [
				['content', s.repeat(config.quote, 2)],
				['display', 'table'],
				['clear', 'both']
			]
		};
	};

}

export = clearfix;
