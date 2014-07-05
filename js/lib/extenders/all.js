var background = require('./background');
var experimental = require('./experimental');
var font = require('./font');
var inlineBlock = require('./inlineBlock');

// ReSharper disable once UnusedLocals
var extenders = {
    background: background,
    experimental: experimental,
    font: font,
    inlineBlock: inlineBlock
};

module.exports = extenders;
