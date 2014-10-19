import Configuration = require('../Configuration');
import inlineBlock = require('../extenders/inlineBlock');
import Override = require('../interfaces/Override');


// ReSharper disable once UnusedLocals
function display(value: string, options?: inlineBlock.Options) {

	var override = <Override>((config: Configuration) => {
		switch (value) {
			case 'inline-block':
				return inlineBlock(options)(config);
			default:
				if (options) {
					throw new Error('Unused options for display override');
				}
				return [['display', value]];
		}
	});

	override.args = arguments;
	return override;

}

export = display;
