import background = require('../extenders/background');
import clearfix = require('../extenders/clearfix');
import experimental = require('../extenders/experimental');
import font = require('../extenders/font');
import inlineBlock = require('../extenders/inlineBlock');


interface Extenders {
	background: typeof background;
	clearfix: typeof clearfix;
	experimental: typeof experimental;
	font: typeof font;
	inlineBlock: typeof inlineBlock;
}

export = Extenders;
