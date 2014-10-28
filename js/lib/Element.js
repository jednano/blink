var Rule = require('./Rule');
var Element = (function () {
    function Element(name, body) {
        this.name = name;
        this.body = body;
    }
    Object.defineProperty(Element.prototype, "modifiers", {
        get: function () {
            return this.body.modifiers || [];
        },
        set: function (value) {
            this.body.modifiers = value;
        },
        enumerable: true,
        configurable: true
    });
    Element.prototype.resolve = function (base, config) {
        var modifiers = this.modifiers;
        delete this.body.modifiers;
        var selector = base + config.element.replace('%s', this.name);
        var resolved = new Rule(selector, this.body).resolve(config);
        this.modifiers = modifiers;
        modifiers.forEach(function (modifier) {
            [].push.apply(resolved, modifier.resolve(selector, config));
        });
        return resolved;
    };
    return Element;
})();
module.exports = Element;
