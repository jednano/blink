import Configuration = require('../Configuration');


// ReSharper disable once UnusedLocals
function inlineBlock(options?: {
		verticalAlign?: string;
	}): any[] {

	options = options || {};

	return [arguments, (config: Configuration) => {
		var decs = [];

		if (config.firefox < 3) {
			decs.push(['display', '-moz-inline-stack']);
		}

		decs.push(['display', 'inline-block']);

		if (options.verticalAlign !== null) {
			decs.push(['vertical-align', options.verticalAlign || 'middle']);
		}

		if (config.ie < 8) {
			decs.push(['*vertical-align', 'auto']);
			decs.push(['zoom', '1']);
			decs.push(['*display', 'inline']);
		}

		return decs;
	}];
}

export = inlineBlock;
