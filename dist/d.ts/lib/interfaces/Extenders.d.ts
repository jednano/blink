import _experimental = require('../extenders/experimental');
import _inlineBlock = require('../extenders/inlineBlock');
interface Extenders {
    experimental: typeof _experimental;
    inlineBlock: typeof _inlineBlock;
}
export = Extenders;
