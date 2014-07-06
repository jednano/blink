var ExtenderRegistry = (function () {
    function ExtenderRegistry() {
        this.extenders = {};
        this.selectors = {};
    }
    ExtenderRegistry.prototype.add = function (extender, selectors) {
        var key = this.createKey(extender);
        if (!this.extenders.hasOwnProperty(key)) {
            this.extenders[key] = extender;
            this.selectors[key] = [];
        }
        Array.prototype.push.apply(this.selectors[key], selectors);
    };

    ExtenderRegistry.prototype.createKey = function (extender) {
        var args = extender.args;
        var extenderName = args.callee.name;
        var serializedArgs = JSON.stringify(Array.prototype.slice.call(args, 0));
        return extenderName + serializedArgs;
    };

    ExtenderRegistry.prototype.forEach = function (callback) {
        var _this = this;
        Object.keys(this.extenders).forEach(function (key) {
            callback(_this.extenders[key], _this.selectors[key]);
        });
    };

    ExtenderRegistry.prototype.map = function (callback) {
        var result = [];
        this.forEach(function (extender, selectors) {
            result.push(callback(extender, selectors));
        });
        return result;
    };
    return ExtenderRegistry;
})();

module.exports = ExtenderRegistry;
