import background = require('../extenders/background');
import clearfix = require('../extenders/clearfix');
import experimental = require('../extenders/experimental');
import font = require('../extenders/font');
import inlineBlock = require('../extenders/inlineBlock');


interface IExtenders {
	background: typeof background;
	clearfix: typeof clearfix;
	experimental: typeof experimental;
	font: typeof font;
	inlineBlock: typeof inlineBlock;
}

export = IExtenders;
