import Configuration = require('./Configuration');


export function inlineBlock(verticalAlign?: string) {
	return (config: Configuration) => {
		var decs = [];
		if (config.browserSupport.firefox < 3) {
			decs.push(['display', '-moz-inline-stack']);
		}
		decs.push(['display', 'inline-block']);
		if (verticalAlign !== null) {
			decs.push(['vertical-align', verticalAlign || 'middle']);
		}
		if (config.browserSupport.ie < 8) {
			decs.push(['*vertical-align', 'auto']);
			decs.push(['zoom', '1']);
			decs.push(['*display', 'inline']);
		}
		return decs;
	};
}
