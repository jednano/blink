var boxSizing = require('./boxSizing');

// ReSharper disable once UnusedLocals
function box(value) {
    if (value.hasOwnProperty('sizing')) {
        return boxSizing(value.sizing);
    }
    // ReSharper disable once NotAllPathsReturnValue
}

module.exports = box;
