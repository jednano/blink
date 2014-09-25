import Override = require('../interfaces/Override');
import boxSizing = require('./boxSizing');


// ReSharper disable once UnusedLocals
function box(value: any) {

	if (value.hasOwnProperty('sizing')) {
		return boxSizing(value.sizing);
	}

	var override = <Override>(() => {
		return [['box', value]];
	});

	override.args = arguments;
	return override;

}

export = box;
