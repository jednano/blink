import Configuration = require('../Configuration');


// ReSharper disable once UnusedLocals
function experimental(property: string, value: any,
	options?: {
		official?: boolean;
		  webkit?: boolean;  // Safari/Chrome, other WebKit
		   khtml?: boolean;  // Konqueror, really old Safari
		     moz?: boolean;  // Firefox, other Gecko
		      ms?: boolean;  // Internet Explorer
		       o?: boolean;  // Opera
	}): any[] {

	options = options || {};

	return [arguments, (config: Configuration) => {
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
	}];
}

export = experimental;
