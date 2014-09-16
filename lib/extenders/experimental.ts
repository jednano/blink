import Configuration = require('../Configuration');
import Extender = require('../interfaces/Extender');

// ReSharper disable once UnusedLocals
function experimental(property: string, value: any,
	options?: {
		official?: boolean;
		  webkit?: boolean;  // Safari/Chrome, other WebKit
		   khtml?: boolean;  // Konqueror, really old Safari
		     moz?: boolean;  // Firefox, other Gecko
		      ms?: boolean;  // Internet Explorer
		       o?: boolean;  // Opera
	}) {

	options = options || {};

	var extender = <Extender>((config: Configuration) => {
		var decs = [];
		['webkit', 'khtml', 'moz', 'ms', 'o'].forEach(vendor => {
			if (options[vendor] && config[vendor + 'Prefix']) {
				decs.push(['-' + vendor + '-' + property, value]);
			}
		});
		if (options.official) {
			decs.push([property, value]);
		}
		return decs;
	});

	extender.args = arguments;
	return extender;
}

export = experimental;
