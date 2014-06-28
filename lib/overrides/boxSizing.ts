import Configuration = require('../Configuration');
import experimental = require('../extenders/experimental');


// http://css-tricks.com/box-sizing/

// ReSharper disable once UnusedLocals
function boxSizing(value: string): any[] {
	return [arguments, (config: Configuration) => {
		return experimental('box-sizing', value, {
			official: true,  // Opera/IE 8+
			  webkit: true,  // Safari/Chrome, other WebKit
			     moz: true   // Firefox, other Gecko
		})[1](config);
	}];
}

export = boxSizing;
