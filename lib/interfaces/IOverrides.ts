import boxSizing = require('../overrides/boxSizing');
import display = require('../overrides/display');


interface IOverrides {
	boxSizing: typeof boxSizing;
	display: typeof display;
}

export = IOverrides;
