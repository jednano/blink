import Configuration = require('../Configuration');
import Extender = require('../interfaces/Extender');

// ReSharper disable once UnusedLocals
function border(options?: {
		width?: string;
		style?: string;
		color?: string;
	}) {

	options = options || {};

	var extender = <Extender>(() => {
		var decs = [];
		return decs;
	});

	extender.args = arguments;
	return extender;
}

export = border;
