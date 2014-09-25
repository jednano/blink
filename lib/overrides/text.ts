import Override = require('../interfaces/Override');
import textSizeAdjust = require('./textSizeAdjust');


// ReSharper disable once UnusedLocals
function text(value: any) {

	if (value.hasOwnProperty('size')) {
		var size = value.size;
		if (size.hasOwnProperty('adjust')) {
			return textSizeAdjust(size.adjust);
		}
	}

	var override = <Override>(() => {
		return [['text', value]];
	});

	override.args = arguments;
	return override;

}

export = text;
