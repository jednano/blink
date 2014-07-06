import Configuration = require('../Configuration');
import experimental = require('../extenders/experimental');
import IOverride = require('../interfaces/IOverride');


// http://css-tricks.com/box-sizing/

// ReSharper disable once UnusedLocals
function boxSizing(value: string) {

	var override = <IOverride>((config: Configuration) => {
		return experimental('box-sizing', value, {
			official: true,  // Opera/IE 8+
			  webkit: true,  // Safari/Chrome, other WebKit
			     moz: true   // Firefox, other Gecko
		})(config);
	});

	override.args = arguments;
	return override;

}

export = boxSizing;
