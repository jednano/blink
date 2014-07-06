import Configuration = require('../Configuration');
import IExtender = require('../interfaces/IExtender');


// ReSharper disable once UnusedLocals
function inlineBlock(options?: {
		verticalAlign?: string;
	}) {

	options = options || {};

	var extender = <IExtender>((config: Configuration) => {
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
	});

	extender.args = arguments;
	return extender;
}

export = inlineBlock;
