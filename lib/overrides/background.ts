import BackgroundOptions = require('../interfaces/css/BackgroundOptions');

// ReSharper disable once UnusedLocals
function background(options?: BackgroundOptions) {

	options = options || {};

	return (() => {

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

}

export = background;
