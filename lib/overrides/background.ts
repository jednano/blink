import _background = require('../extenders/background');
import IOverride = require('../interfaces/IOverride');

// ReSharper disable once UnusedLocals
function background(value: any) {

	var override = <IOverride>(() => {
		return _background(value)();
	});

	override.args = arguments;
	return override;

}

export = background;
