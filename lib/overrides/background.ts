import BackgroundOptions = require('../interfaces/css/BackgroundOptions');
import Configuration = require('../Configuration');

// ReSharper disable once UnusedLocals
function background(options?: BackgroundOptions) {

	options = options || {};

	// ReSharper disable once UnusedParameter
	return (config: Configuration) => {

		var values = [];

		['color', 'image', 'repeat', 'attachment', 'position'].forEach(prop => {
			if (options.hasOwnProperty(prop)) {
				values.push(options[prop]);
			}
		});

		if (values.length) {
			return [['background', values.join(' ')]];
		}

		return [];

	};

}

export = background;
