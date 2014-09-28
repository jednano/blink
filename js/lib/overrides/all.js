var appearance = require('./appearance');
var background = require('./background');
var box = require('./box');
var boxSizing = require('./boxSizing');
var clearfix = require('./clearfix');
var display = require('./display');
var font = require('./font');
var text = require('./text');
var textSizeAdjust = require('./textSizeAdjust');

// ReSharper disable once UnusedLocals
var overrides = {
    appearance: appearance,
    background: background,
    box: box,
    boxSizing: boxSizing,
    clearfix: clearfix,
    display: display,
    font: font,
    text: text,
    textSizeAdjust: textSizeAdjust
};

module.exports = overrides;