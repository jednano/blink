import Configuration = require('../Configuration');


interface IExtender {
	args: IArguments;
	selectors?: string[];
	(config?: Configuration): any[][];
}

export = IExtender;
