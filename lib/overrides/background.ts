import Override = require('../interfaces/Override');
import BackgroundOptions = require('../interfaces/css/BackgroundOptions');

// ReSharper disable once UnusedLocals
function background(options?: BackgroundOptions) {

	options = options || {};

	var override = <Override>(() => {

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

	override.args = arguments;
	return override;

}

export = background;
