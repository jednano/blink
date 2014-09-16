import Extender = require('../interfaces/Extender');

// ReSharper disable once UnusedLocals
function background(options?: {
		color?: string;
		image?: string;
		repeat?: string;
		attachment?: string;
		position?: any;
	}) {

	options = options || {};

	var extender = <Extender>(() => {

		var values = [];

		['color', 'image', 'repeat', 'attachment', 'position'].forEach(prop => {
			if (options.hasOwnProperty(prop)) {
				values.push(options[prop]);
			}
		});

		if (values.length) {
			return [['background', values]];
		}

		return [];

	});

	extender.args = arguments;
	return extender;

}

export = background;
