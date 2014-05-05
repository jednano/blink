import boxSizing = require('./boxSizing');
import experimental = require('./experimental');
import inlineBlock = require('./inlineBlock');


var extenders: Function[] = [
	boxSizing,
	experimental,
	inlineBlock
];

export = extenders;
