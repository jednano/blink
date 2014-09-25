import background = require('../extenders/background');
import border = require('../extenders/border');
import experimental = require('../extenders/experimental');
import font = require('../extenders/font');
import inlineBlock = require('../extenders/inlineBlock');


interface Extenders {
	background: typeof background;
	border: typeof border;
	experimental: typeof experimental;
	font: typeof font;
	inlineBlock: typeof inlineBlock;
}

export = Extenders;
