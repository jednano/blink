import boxSizing = require('./boxSizing');
import Configuration = require('../Configuration');

// ReSharper disable once UnusedLocals
function box(value: any) {

	if (value.hasOwnProperty('sizing')) {
		return boxSizing(value.sizing);
	}

	// ReSharper disable once NotAllPathsReturnValue

}

export = box;
