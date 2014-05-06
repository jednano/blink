import boxSizing = require('./boxSizing');
import experimental = require('./experimental');
import inlineBlock = require('./inlineBlock');


// ReSharper disable once UnusedLocals
var extenders: Function[] = [
	boxSizing,
	experimental,
	inlineBlock
];

export = extenders;
