import Extenders = require('../interfaces/Extenders');
import appearance = require('./appearance');
import background = require('./background');
import border = require('./border');
import boxSizing = require('./boxSizing');
import clearfix = require('./clearfix');
import experimental = require('./experimental');
import font = require('./font');
import inlineBlock = require('./inlineBlock');


// ReSharper disable once UnusedLocals
var extenders: Extenders = {
	appearance: appearance,
	background: background,
	border: border,
	boxSizing: boxSizing,
	clearfix: clearfix,
	experimental: experimental,
	font: font,
	inlineBlock: inlineBlock
};

export = extenders;
