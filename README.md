<img src="https://github.com/blinkjs/blink/blob/master/artwork/blink_256_nobg.png?raw=true" width="256" height="256" alt="blink" align="right">

Blink converts [Node.js](http://nodejs.org/) modules into CSS.

[![Build Status](https://secure.travis-ci.org/blinkjs/blink.svg)](http://travis-ci.org/blinkjs/blink)
[![Dependency Status](https://david-dm.org/blinkjs/blink.svg)](https://david-dm.org/blinkjs/blink)
[![NPM version](https://badge.fury.io/js/blink.svg)](http://badge.fury.io/js/blink)

[![Views](https://sourcegraph.com/api/repos/github.com/blinkjs/blink/counters/views-24h.png)](https://sourcegraph.com/github.com/blinkjs/blink)
[![Code Climate](https://codeclimate.com/github/blinkjs/blink/badges/gpa.svg)](https://codeclimate.com/github/blinkjs/blink)
[![Test Coverage](https://codeclimate.com/github/blinkjs/blink/badges/coverage.svg)](https://codeclimate.com/github/blinkjs/blink)

[![NPM](https://nodei.co/npm/blink.svg?downloads=true)](https://nodei.co/npm/blink/)


## Introduction

If you landed here, you're probably a front-end web developer of some kind. You know how to write JavaScript. You might even have a favorite CSS preprocessor. Sure, they allow you to write [variables and functions](http://sass-lang.com/guide) in some form or another, but they also require that you learn their domain-specific language (DSL), which often falls short of a full-blown language. You scour their documentation, struggling to find solutions to problems you already know how to solve in JavaScript. We keep looking for ways to introduce logic into our CSS, so why not just use JavaScript?

Blink doesn't need to do anything special to support functions, because blink runs actual JavaScript. This means the equivalent of [Sass](http://sass-lang.com/) [mixins](http://sass-lang.com/guide) can be achieved in blink by means of a function that returns any number of CSS declarations. In blink, these are implemented as [overrides](#overrides). For example, the [fill override](#fill) allows you to add `{ fill: true }` to your rule body, which, in turn, generates 5 CSS declarations to fill its relative or absolute container.

Blink follows the Single Responsibility Principle (SRP), which means it doesn't try to do too much. As such, you are encouraged to combine blink with other tools to achieve the best result. For example, use [Autoprefixer](https://github.com/postcss/autoprefixer) to add vendor prefixes and [Spritesmith](https://github.com/Ensighten/spritesmith) to generate sprites, which can then be implemented directly in blink. There are a plethora of Node modules you can leverage.

Blink is just getting started, so stay tuned for any updates.


## Features

- [100% code coverage](https://codeclimate.com/github/blinkjs/blink)
- [4.0 Code Climate GPA](https://codeclimate.com/github/blinkjs/blink)
- [Runs on Node](#runs-on-node)
- [Gulp plugin](#gulp-plugin)
- [Grunt plugin](https://github.com/blinkjs/grunt-blink)
- [Middleware](https://github.com/blinkjs/blink-middleware)
- [Browserified](#browserified)
- [OOCSS with BEM Syntax](#oocss-with-bem)
- [Rules](#rules)
- [Mixins](#mixins)
- [Overrides](#overrides)
- [Responders](#responders)
- [Plugins](#plugins)
- [TypeScript Source](#typescript-source)
- [CLI](https://github.com/blinkjs/blink-cli)
- [API](https://github.com/blinkjs/blink/blob/master/blink.d.ts)


## Getting started


### Installation
- [Node](#library-usage)
- [In the browser](#browserified)


### Example

At its simplest, blink lets you write CSS with a simple [object initializer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects#Using_object_initializers). This object needs to be exported with either `module.exports` in Node or just `exports` in the browser. Here's a quick and dirty example:

```js
exports = {
  foo: {
    bar: 'baz'
  }
};
```

This would generate the following CSS:

```css
foo {
  bar: baz;
}
```

From here, you'll want look at [the full list of features](#features) for a comprehensive overview of what-all blink has to offer.


### Runs on Node

Unlike most CSS preprocessors out there, blink does not transpile a [DSL](http://en.wikipedia.org/wiki/Domain-specific_language) into CSS. Blink code gets compiled directly as a [Node](http://nodejs.org/) module, giving you access to all JavaScript syntax for free. This, of course, includes variables and functions, as well as [file I/O](http://nodejs.org/api/fs.html). The possibilities are endless.


### Gulp plugin

Blink is, itself, a gulp plugin. As with any gulp plugin, files can be piped to other [gulp plugins](http://gulpjs.com/plugins/) before being written to their final destination. Blink supports [vinyl](https://github.com/wearefractal/vinyl) files in buffer mode only (streams not supported).

```js
var blink = require('blink');
var gulp = require('gulp');

gulp.task('styles', function() {
	return gulp.src('styles/**/*.js')
		.pipe(blink('styles.css', /* options */))
		.on('error', function(err) {
			// handle error
		})
		.pipe(gulp.dest('dist/styles'));
});
```

_Note: [gulp-blink](https://github.com/blinkjs/gulp-blink) has been deprecated in favor of using the blink module directly._


### Browserified

For those wishing to transpile blink files into CSS in the browser, a [Browserified](http://browserify.org/) version of blink is available in the [dist folder](https://github.com/blinkjs/blink/tree/master/dist), also available as a [bower component](http://bower.io/search/?q=blink).

```bash
$ bower install --save blink
```

Include the script in your web page:

```html
<script src="/bower_components/blink/dist/blink.js"/>
```

Compile your block:

```js
var foo = new blink.Block('foo', { bar: 'baz' });
blink(foo, function(err, css) {
  console.log(css);
});
```

You can also compile a string of source code as long as you export the rule with `exports`.

```js
var foo = "exports = new blink.Block('foo', { bar: 'baz' });";
blink(foo, function(err, css) {
  console.log(css);
});
```


### OOCSS with BEM

Blink is designed with [BEM syntax](http://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/) in mind. You can create blocks, elements and modifiers and their CSS selectors will be generated for you. You can configure your BEM format however you want, but the default naming convention follows that which is defined in [MindBEMding &ndash; getting your head 'round BEM syntax](http://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/).

Here's an example of a block with both an element and a modifier:

```ts
///<reference path="./node_modules/blink/blink.d.ts"/>
import blink = require('blink');

var btn = new blink.Block('btn', {

	min: {
		width: 80
	},

	elements: [
		new blink.Element('foreground', {
			color: 'black'
		})
	],

	modifiers: [
		new blink.Modifier('wide', {
			min: {
				width: 120
			}
		})
	]
});

export = btn;
```

This would generate the following CSS:

```css
.btn {
	min-width: 80px;
}

.btn__foreground {
	color: black;
}

.btn--wide {
	min-width: 120px;
}
```


### Rules

The [Rule](https://github.com/blinkjs/blink/blob/master/lib/Rule.ts) class allows you to specify a standard CSS rule and can be useful when styling page defaults.


```ts
///<reference path="./node_modules/blink/blink.d.ts"/>
import blink = require('blink');

var normalize = [

	new blink.Rule('html', {
		font: {
			family: 'sans-serif'
		}
	}),

	new blink.Rule('body', {
		margin: 0
	}),

	new blink.Rule('a:active, a:hover', {
		outline: 0
	})

	// ...

];

export = normalize;
```

You are encouraged to use BEM blocks for all of your components. There's nothing stopping you from using basic rules, but you should avoid them if at all possible.


### Mixins

If you're coming from [Sass](http://sass-lang.com/), you might be familiar with [mixins](http://sass-lang.com/guide). Really, Sass mixins are no different than functions in JavaScript; thus, blink supports them. All you have to do is create a function that returns an array of declarations. This is, in fact, how [overrides](#overrides) work.


### Overrides

Overrides are named function [factories](http://en.wikipedia.org/wiki/Factory_(object-oriented_programming). The function that is returned can be used for the purpose of generating any number of CSS declarations. This enables you to override existing CSS properties or create your own. For example, say you wanted to override the CSS `color` property to always convert colors into `hsl`. You could do that! Maybe you want to create a new `clearfix` property that, when set to true, generates 3 CSS declarations. Good news &ndash; [that one already exists](https://github.com/blinkjs/blink/blob/master/lib/overrides/clearfix.ts)!


#### box-sizing

Let's take an in-depth look at the [box-sizing override](https://github.com/blinkjs/blink/blob/master/lib/overrides/boxSizing.ts). Here's how you would go about writing it from scratch, in TypeScript.

```ts
function boxSizing() {}
export = boxSizing;
```

Firstly, overrides are just functions, but they are function factories, which means they need to return a function. Let's do that.

```ts
import blink = require('blink');

function boxSizing(value: string) {

	return (config: blink.Configuration) => {
	};

}

export = boxSizing;
```

We've imported the blink library to gain access to the [Configuration](https://github.com/blinkjs/blink/blob/master/lib/Configuration.ts) class.
We're accepting a `value: string` argument, because we know that `box-sizing` accepts one of `content-box`, `padding-box`, `border-box` or `inherit`. It doesn't accept numeric values or anything like that. See [box-sizing on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/box-sizing?redirectlocale=en-US&redirectslug=CSS%2Fbox-sizing).

Next, we created a new function and immediately return it. This function will be provided the configuration object, which gives you all the information you need to make informed decisions about how your override should build-out CSS declarations.

The `box-sizing` property is actually quite simple. All we need to do is add some vendor prefixes. Fortunately, blink has an [experimental extender](https://github.com/blinkjs/blink/blob/master/lib/extenders/experimental.ts) for just that purpose.

```ts
import blink = require('blink');

function boxSizing(value: string) {

	return (config: blink.Configuration) => {
		return blink.config.extenders.experimental('box-sizing', value, {
			official: true,
			webkit: !(
				config.chrome >= 10 &&
				config.safari >= 5.1 &&
				config.android >= 4
			),
			moz: !(
				config.firefox >= 29 &&
				config.firefoxMobile >= 29
			)
		})(config);
	};

}

export = boxSizing;
```

The experimental extender is quite handy, but we still need to know which vendor prefixes to generate. Refer to [the Can I Use support table](http://caniuse.com/#search=box-sizing) and/or [MDN's box-sizing browser compatability table](https://developer.mozilla.org/en-US/docs/Web/CSS/box-sizing#Browser_compatibility) for in-depth browser support information.

Once you implement the correct browser versions, anyone using your override will only generate the vendor prefixes they intend to support. If they change their configuration file to drop support for older browsers, it could generate no vendor prefixes at all. It really depends on the configuration. This is a blink paradigm that you would do well to follow.


#### Override registration

Overrides are registered on the configuration object. If you wish to extend the configuration, you can do so by providing [a plugin module](#plugins).

_Note: override names are dasherized for you (e.g., boxSizing overrides the `box-sizing` property)._


#### fill

Not all overrides deal with vendor prefixes. Some will only generate CSS declarations. Let's take a look at the [fill override](https://github.com/blinkjs/blink/blob/master/lib/overrides/fill.ts), which does exactly that.

```ts
import blink = require('blink');

function fill(value: boolean) {

	return (config: blink.Configuration) => {
		if (!value) {
			return [];
		}
		return [
			['position', 'absolute'],
			['top', '0'],
			['right', '0'],
			['bottom', '0'],
			['left', '0']
		];
	};

}

export = fill;
```

This override will only generate CSS declarations if you call it with `{ fill: true }` in the rule body. If you call it with `false`, it returns an empty array, which gets ignored by the compiler. As you can see, there are no vendor prefixes here and, really, no logic worth mentioning. It just generates 5 declarations and leaves it at that &ndash; pretty simple.

See the [display override](https://github.com/blinkjs/blink/blob/master/lib/overrides/display.ts) for a more complex example that illustrates both vendor prefixes as well as CSS hacks for certain browser versions.


### Responders

Responders currently only support [MediaAtRules](https://github.com/blinkjs/blink/blob/master/lib/MediaAtRule.ts), which allow you to create responsive websites. Here's an example of a basic responder:

```ts
///<reference path="./node_modules/blink/blink.d.ts"/>
import blink = require('blink');

var foo = new blink.Block('foo', {
	respond: [
		new blink.MediaAtRule('screen and (max-width: 320)', {
			width: 100
		})
	]
});

export = foo;
```

This generates the following CSS:

```css
@media screen and (max-width: 320) {
	.foo {
		width: 100px;
	}
}
```


### Plugins

Plugins can be defined in the configuration like so:

```json
{
  "plugins": ["yourname.overrides"]
}
```

If you were to publish an npm package under the name `yourname.overrides` and if you wanted to override the boxSizing override that blink already provides, you could do it like so:

```ts
function plugin() {
	this.overrides.boxSizing = require('./overrides/boxSizing');
	return this;
}
```

Now, every time someone declares `box-sizing: whatever` your override will be called with `whatever` as the first and only argument. The returned set of declarations will replace the original one. In this case, however, `box-sizing` does nothing with arguments.


### Node API

With all the new build tools and taks runners springing up, blink was built with that in mind, that various tools would need access to the compiled results without writing any files to the disk.


### TypeScript Source

Since blink source code is written in [TypeScript][], you don't need to constantly look-up documentation to gain insight as to how you can use the blink API. Unfortunately, although there is [TypeScript][] support for [other editors](http://msopentech.com/blog/2012/10/01/sublime-text-vi-emacs-typescript-enabled/), you won't get the powerful feature of Intellisense unless you are using [Visual Studio](http://www.visualstudio.com/).

BTW, you can write your blink files in [TypeScript][] or JavaScript. It really doesn't matter as long as it ends up in JavaScript.


## Getting Started


### CLI Usage

See [blink-cli](https://github.com/blinkjs/blink-cli)


### Library Usage

```bash
$ npm install --save-dev blink
```

```ts
///<reference path="./node_modules/blink/blink.d.ts"/>
import blink = require('blink');
```


Refer to the [blink TypeScript definition](https://github.com/blinkjs/blink/blob/master/blink.d.ts) for a list of available public methods.


## License

Released under the MIT license.



[TypeScript]: http://www.typescriptlang.org/
