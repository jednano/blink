import Configuration = require('../Configuration');
import inlineBlock = require('../extenders/inlineBlock');


// ReSharper disable once UnusedLocals
function display(value: string, options?: inlineBlock.Options) {

	return (config: Configuration): any => {
		switch (value) {
			case 'inline-block':
				return inlineBlock(options)(config);
			default:
				if (options) {
					throw new Error('Unused options for display override');
				}
				return value;
		}
	};

}

export = display;
