import boxSizing = require('./boxSizing');
import display = require('./display');
import experimental = require('./experimental');
import inlineBlock = require('./inlineBlock');


// ReSharper disable once UnusedLocals
var extenders: Function[] = [
	boxSizing,
	display,
	experimental,
	inlineBlock
];

export = extenders;
