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

	// ReSharper disable once NotAllPathsReturnValue

}

export = text;
