import Extenders = require('../interfaces/Extenders');
import background = require('./background');
import border = require('./border');
import experimental = require('./experimental');
import font = require('./font');
import inlineBlock = require('./inlineBlock');


// ReSharper disable once UnusedLocals
var extenders: Extenders = {
	background: background,
	border: border,
	experimental: experimental,
	font: font,
	inlineBlock: inlineBlock
};

export = extenders;
