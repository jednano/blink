import _background = require('../extenders/background');
import Override = require('../interfaces/Override');

// ReSharper disable once UnusedLocals
function background(value: any) {

	var override = <Override>(() => {
		return _background(value)();
	});

	override.args = arguments;
	return override;

}

export = background;
