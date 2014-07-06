import Configuration = require('../Configuration');
import inlineBlock = require('../extenders/inlineBlock');
import IOverride = require('../interfaces/IOverride');


// ReSharper disable once UnusedLocals
function display(value: string) {

	var override = <IOverride>((config: Configuration) => {
		switch (value) {
			case 'inline-block':
				return inlineBlock()(config);
			default:
				return [['display', value]];
		}
	});

	override.args = arguments;
	return override;

}

export = display;
