import Configuration = require('../Configuration');
import experimental = require('../extenders/experimental');
import Override = require('../interfaces/Override');


// http://css-tricks.com/box-sizing/

// ReSharper disable once UnusedLocals
function boxSizing(value: string) {

	var override = <Override>((config: Configuration) => {
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
