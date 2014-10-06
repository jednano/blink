import experimental = require('../extenders/experimental');
import font = require('../extenders/font');
import inlineBlock = require('../extenders/inlineBlock');

interface Extenders {
	experimental: typeof experimental;
	font: typeof font;
	inlineBlock: typeof inlineBlock;
}

export = Extenders;
