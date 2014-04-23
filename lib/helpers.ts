import Configuration = require('./Configuration');


export interface IInlineBlockOptions {
	verticalAlign: string;
}

export function inlineBlock(options: IInlineBlockOptions) {
	options = options || <any>{};
	return (config: Configuration) => {
		var decs = [];
		if (config.browserSupport.firefox < 3) {
			decs.push(['display', '-moz-inline-stack']);
		}
		decs.push(['display', 'inline-block']);
		if (options.verticalAlign !== null) {
			decs.push(['vertical-align', options.verticalAlign || 'middle']);
		}
		if (config.browserSupport.ie < 8) {
			decs.push(['*vertical-align', 'auto']);
			decs.push(['zoom', '1']);
			decs.push(['*display', 'inline']);
		}
		return decs;
	};
}
