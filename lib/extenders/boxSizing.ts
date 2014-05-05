import Configuration = require('../Configuration');
import experimental = require('./experimental');


// http://css-tricks.com/box-sizing/

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
