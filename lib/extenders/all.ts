import Extenders = require('../interfaces/Extenders');
import background = require('./background');
import clearfix = require('./clearfix');
import experimental = require('./experimental');
import font = require('./font');
import inlineBlock = require('./inlineBlock');


// ReSharper disable once UnusedLocals
var extenders: Extenders = {
	background: background,
	clearfix: clearfix,
	experimental: experimental,
	font: font,
	inlineBlock: inlineBlock
};

export = extenders;
