import Extenders = require('../interfaces/Extenders');
import background = require('./background');
import experimental = require('./experimental');
import font = require('./font');
import inlineBlock = require('./inlineBlock');


// ReSharper disable once UnusedLocals
var extenders: Extenders = {
	background: background,
	experimental: experimental,
	font: font,
	inlineBlock: inlineBlock
};

export = extenders;
