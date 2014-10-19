import Configuration = require('../Configuration');
import Extender = require('../interfaces/Extender');


// ReSharper disable once UnusedLocals
function inlineBlock(options?: inlineBlock.Options) {

	options = options || {};

	var extender = <Extender>((config: Configuration) => {
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

// ReSharper disable once InconsistentNaming
module inlineBlock {
	export interface Options {
		verticalAlign?: string;
	}
}

export = inlineBlock;
