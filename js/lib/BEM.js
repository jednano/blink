var Rule = require('./Rule');
var Block = (function () {
    function Block(name, body) {
        this.name = name;
        this.body = body;
    }
    Object.defineProperty(Block.prototype, "elements", {
        get: function () {
            return this.body.elements;
        },
        set: function (value) {
            this.body.elements = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Block.prototype, "modifiers", {
        get: function () {
            return this.body.modifiers;
        },
        set: function (value) {
            this.body.modifiers = value;
        },
        enumerable: true,
        configurable: true
    });
    Block.prototype.resolve = function (config) {
        var elements = this.elements;
        delete this.body.elements;
        var modifiers = this.modifiers;
        delete this.body.modifiers;
        var selector = config.block.replace('%s', this.name);
        var resolved = new Rule(selector, this.body).resolve(config);
        this.elements = elements;
        this.modifiers = modifiers;
        Object.keys(elements || {}).forEach(function (key) {
            var element = new Element(key, elements[key]);
            [].push.apply(resolved, element.resolve(selector, config));
        });
        Object.keys(modifiers || {}).forEach(function (key) {
            var modifier = new Modifier(key, modifiers[key]);
            [].push.apply(resolved, modifier.resolve(selector, config));
        });
        return resolved;
    };
    return Block;
})();
exports.Block = Block;
var Element = (function () {
    function Element(name, body) {
        this.name = name;
        this.body = body;
    }
    Object.defineProperty(Element.prototype, "modifiers", {
        get: function () {
            return this.body.modifiers;
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
        Object.keys(modifiers || {}).forEach(function (key) {
            var modifier = new Modifier(key, modifiers[key]);
            [].push.apply(resolved, modifier.resolve(selector, config));
        });
        return resolved;
    };
    return Element;
})();
exports.Element = Element;
var Modifier = (function () {
    function Modifier(name, body) {
        this.name = name;
        this.body = body;
    }
    Object.defineProperty(Modifier.prototype, "elements", {
        get: function () {
            return this.body.elements;
        },
        set: function (value) {
            this.body.elements = value;
        },
        enumerable: true,
        configurable: true
    });
    Modifier.prototype.resolve = function (base, config) {
        var elements = this.elements;
        delete this.body.elements;
        var selector = base + config.modifier.replace('%s', this.name);
        var resolved = new Rule(selector, this.body).resolve(config);
        this.elements = elements;
        Object.keys(elements || {}).forEach(function (key) {
            var element = new Element(key, elements[key]);
            [].push.apply(resolved, element.resolve(selector, config));
        });
        return resolved;
    };
    return Modifier;
})();
exports.Modifier = Modifier;
