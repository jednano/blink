import Override = require('../interfaces/Override');
import boxSizing = require('./boxSizing');


// ReSharper disable once UnusedLocals
function box(value: any) {

	if (value.hasOwnProperty('sizing')) {
		return boxSizing(value.sizing);
	}

	// ReSharper disable once NotAllPathsReturnValue

}

export = box;
