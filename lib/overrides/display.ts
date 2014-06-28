import Configuration = require('../Configuration');
import inlineBlock = require('../extenders/inlineBlock');


// ReSharper disable once UnusedLocals
function display(value: string): any[] {

	return [arguments, (config: Configuration) => {
		switch (value) {
			case 'inline-block':
				return inlineBlock()[1](config);
			default:
				return [['display', value]];
		}
	}];
}

export = display;
