import Extenders = require('../interfaces/Extenders');
import experimental = require('./experimental');
import inlineBlock = require('./inlineBlock');


// ReSharper disable once UnusedLocals
var extenders: Extenders = {
	experimental: experimental,
	inlineBlock: inlineBlock
};

export = extenders;
