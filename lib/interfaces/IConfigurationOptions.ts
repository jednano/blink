interface IConfigurationOptions {

	config?: string;

	// Output style
	style?: string;
	oneIndent?: string;
	quote?: string;
	newline?: string;

	// BEM
	block?: string;
	element?: string;
	modifier?: string;

	// Legacy browser support
	chrome?: number;
	firefox?: number;
	ie?: number;
	opera?: number;

	// Experimental support
	webkitPrefix?: boolean;
	khtmlPrefix?: boolean;
	mozPrefix?: boolean;
	msPrefix?: boolean;
	oPrefix?: boolean;

}

export = IConfigurationOptions;
