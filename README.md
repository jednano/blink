<img src="https://github.com/blinkjs/blink/blob/master/artwork/blink_256_nobg.png?raw=true" width="256" height="256" alt="blink" align="right">

Blink converts [Node.js][] modules into CSS.

[![Build Status](https://secure.travis-ci.org/blinkjs/blink.svg)](http://travis-ci.org/blinkjs/blink)
[![Dependency Status](https://david-dm.org/blinkjs/blink.svg)](https://david-dm.org/blinkjs/blink)
[![NPM version](https://badge.fury.io/js/blink.svg)](http://badge.fury.io/js/blink)

[![Views](https://sourcegraph.com/api/repos/github.com/blinkjs/blink/counters/views-24h.png)](https://sourcegraph.com/github.com/blinkjs/blink)
[![Code Climate](https://codeclimate.com/github/blinkjs/blink/badges/gpa.svg)](https://codeclimate.com/github/blinkjs/blink)
[![Test Coverage](https://codeclimate.com/github/blinkjs/blink/badges/coverage.svg)](https://codeclimate.com/github/blinkjs/blink)

[![NPM](https://nodei.co/npm/blink.svg?downloads=true)](https://nodei.co/npm/blink/)


## Introduction

If you landed here, you're probably a front-end web developer of some kind. You know how to write JavaScript. You might even have a favorite CSS preprocessor. Sure, they allow you to write [variables and functions](http://sass-lang.com/guide) in some form or another, but they require you learn their domain-specific language, which often falls short of a full-blown language.  You scour their documentation, struggling to find a solutions to problems you already know how to solve in JavaScript. We keep looking for ways to introduce logic into our CSS, so why not just use JavaScript?

[Compass](http://compass-style.org/) provides some great [cross-browser mixins to takes care of vendor prefixes](http://compass-style.org/reference/compass/css3/), but it falls short in that you have to remember to use them and they add considerable bloat if not implemented properly (i.e., [@extend](http://sass-lang.com/documentation/file.SASS_REFERENCE.html#extend)). Blink aims to solve this problem with [overrides](#overrides) that enforce developers to use them without even knowing it. For example, overriding the `display` property would mean that anyone using `display: inline-block;` would automatically [extend](#extenders) the [inlineBlock extender](https://github.com/blinkjs/blink/blob/master/lib/extenders/inlineBlock.ts). This means you can use the latest and greatest techniques of CSS development without trying to remember when you need vendor prefixes for certain CSS declarations.

With blink, browser support is a configuration setting, so when your browser support requirements change, none of your source code has to change. All you do is update your configuration to support different browser versions by setting the minimum versions you wish to support.

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
- [Includes](#includes)
- [Mixins](#mixins)
- [Overrides](#overrides)
- [Extenders](#extenders)
- [Responders](#responders)
- [Plugins](#plugins)
- [TypeScript Source](#typescript-source)
- [CLI](https://github.com/blinkjs/blink-cli)
- [API](https://github.com/blinkjs/blink/blob/master/blink.d.ts)
- [Express middleware](https://github.com/blinkjs/blink-middleware)
- [Spriting](#spriting)


## Getting started


### Installation
- [Node](#library-usage)
- [In the browser](#browserified)


### Example

At its simplest, blink lets you write CSS with a simple [object initializer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects#Using_object_initializers).
This object needs to be exported with either `module.exports` in Node or just `exports` in the browser.
Here's a quick and dirty example:

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

Unlike most CSS preprocessors out there, blink does not transpile a [DSL](http://en.wikipedia.org/wiki/Domain-specific_language) into CSS. Blink code gets compiled directly as a [Node][] module, giving you access to all JavaScript syntax for free. This, of course, includes variables and functions, as well as [file I/O](http://nodejs.org/api/fs.html). The possibilities are endless.


### Gulp plugin

Blink is, itself, a gulp plugin.
As with any gulp plugin, files can be piped to other [gulp plugins](http://gulpjs.com/plugins/) before being written to their final destination.
Blink supports [vinyl](https://github.com/wearefractal/vinyl) files in buffer mode only (streams not supported).

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

Blink is designed with [BEM syntax][] in mind. You can create blocks, elements and modifiers and their CSS selectors will be generated for you. You can configure your BEM format however you want, but the default naming convention follows that which is defined in [MindBEMding &ndash; getting your head 'round BEM syntax][].

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


### Includes

Blink supports includes, but not in the way you might think. Includes are just functions that return an array of declarations. As such, you should lean against using them at all costs. Why? Say your include spits out 10 declarations. Every time you include that function you'll add another 10 lines of CSS to your file. Instead, use [extenders](#extenders) and [overrides](#overrides) when possible.

You might be wondering why blink supports includes at all if you aren't supposed to use them. This is because blink uses includes in the background to make [extenders](#extenders) work. As such, includes may be removed at a future date, if they can be worked out of the extender logic.

Still, if you find yourself needing an include, refer to [the Rule spec](https://github.com/blinkjs/blink/blob/master/test/spec/lib/Rule.spec.ts#L80-L97) for a working example.


### Mixins

If you're coming from [Sass](http://sass-lang.com/), you might be familiar with [mixins](http://sass-lang.com/guide). Really, Sass mixins are no different than functions in JavaScript; thus, blink supports them. All you have to do is create a function that returns an array of declarations. This is, in fact, how [extenders](#extenders) and [overrides](#overrides) work.


### Overrides

Overrides are named function [factories](http://en.wikipedia.org/wiki/Factory_(object-oriented_programming).
The function that is returned can be used for the purpose of generating any number of CSS declarations.
This enables you to override existing CSS properties or create your own.
For example, say you wanted to override the CSS `color` property to always convert colors into `hsl`. You could do that!
Maybe you want to create a new `clearfix` property that, when set to true, generates 3 CSS declarations. Good news &ndash; [that one already exists](https://github.com/blinkjs/blink/blob/master/lib/overrides/clearfix.ts)!

Let's take an in-depth look at the [box-sizing override](https://github.com/blinkjs/blink/blob/master/lib/overrides/boxSizing.ts).
Here's how you would go about writing it from scratch.

```ts
function boxSizing() {}
export = boxSizing;
```

Overrides must be named functions with a unique name.
This name is what allows the blink compiler to reuse the override in other rules where it is called; thus, never generating the same code twice.
If you're coming from Sass, you'll know that you have to go out of your way to get this kind of functionality with `@extend`.
With blink, you get it for free.

Let's return a function.

```ts
import blink = require('blink');

function boxSizing(value: string) {

	var override = <blink.Override>((config: blink.Configuration) => {
	});

	override.args = arguments;
	return override;

}

export = boxSizing;
```

We've imported the blink library to gain access to the [Override](https://github.com/blinkjs/blink/blob/master/lib/interfaces/Override.ts) interface, as well as the [Configuration](https://github.com/blinkjs/blink/blob/master/lib/Configuration.ts) class.
We're accepting a `value: string` argument, because we know it can be one of `content-box`, `padding-box`, `border-box` or `inherit`. It doesn't accept numeric values or anything like that. See [box-sizing on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/box-sizing?redirectlocale=en-US&redirectslug=CSS%2Fbox-sizing).
Next, we created a new function and assigned it to the `override` variable.
The function must be assigned `args` before it is returned. This copies the `arguments` that were originally sent to the override.
Remember how I said your override never generates the same code twice? More accurately, your override, when called with the same arguments, never generates the same code twice.
Copying the arguments is what allows this process to work properly.

The `box-sizing` property is actually quite simple. All we need to do is add some vendor prefixes.
Fortunately, blink has an [experimental extender](https://github.com/blinkjs/blink/blob/master/lib/extenders/experimental.ts) for that.
Let's work it into this override.

```ts
import blink = require('blink');

function boxSizing(value: string) {

	var override = <blink.Override>((config: blink.Configuration) => {
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
	});

	override.args = arguments;
	return override;

}

export = boxSizing;
```

The experimental extender is quite handy, but we still need to know which vendor prefixes to generate.
Refer to [MDN's box-sizing browser compatability table](https://developer.mozilla.org/en-US/docs/Web/CSS/box-sizing#Browser_compatibility) for just that information.
Once you implement the correct browser versions, anyone using your override will only generate the vendor prefixes they intend to support.
If they change their configuration file to drop support for older browsers, it could generate no vendor prefixes at all.
It really depends on the configuration. This is a blink paradigm that you would do well to follow.

Overrides are registered on the configuration object. If you wish to extend the configuration, you can do so by providing [a plugin module](#plugins).

_Note: override names are dasherized for you (e.g., boxSizing overrides the `box-sizing` property)._


### Extenders

Extenders are named function factories, just like [overrides](#overrides).
In fact, they are exactly the same. The only difference is how they are used.
Extenders cannot be called directly from the rule body, like overrides.
Instead, they are typically called other extenders or from overrides, as we did with the `box-sizing` override.
The rules for extenders are just the same.
Here's an example of a `fill` extender that fills its container:

```ts
import blink = require('blink');

function fill() {

	var extender = <blink.Extender>(() => {
		return [
			['position', 'absolute'],
			['top', '0'],
			['right', '0'],
			['bottom', '0'],
			['left', '0']
		];
	});

	extender.args = arguments;
	return extender;

}

export = fill;
```

Pretty simple, right? You might choose to create a `fill` override that, internally, calls this extender.
This would make sense for a rule body of `{ fill: true }`.

Now, let's talk about building your own extenders. Here's how you would go about building an `inlineBlock` extender.

```ts
import blink = require('blink');

function inlineBlock() {
	var extender = <blink.Extender>(() => {
		return ['display', 'inline-block'];
	});
}

export = inlineBlock;
```

This is all fine and good, but it's pretty useless. We can add a `verticalAlign` option to make it more dynamic.

```ts
import blink = require('blink');

function inlineBlock(options?: {
		verticalAlign?: string;
	}) {

	options = options || {};

	var extender = <blink.Extender>((config: blink.Configuration) => {
		var decs = [];

		decs.push(['display', 'inline-block']);

		if (options.verticalAlign !== null) {
			decs.push(['vertical-align', options.verticalAlign || 'middle']);
		}

		return decs;
	});

	extender.args = arguments;
	return extender;
}

export = inlineBlock;
```

Great, but what about inline-block CSS hacks? Glad you asked! You can gain access to the configuration for a case like this.

```ts
import blink = require('blink');

function inlineBlock(options?: {
		verticalAlign?: string;
	}) {

	options = options || {};

	var extender = <blink.Extender>((config: blink.Configuration) => {
		var decs = [];

		if (config.firefox < 3) {
			decs.push(['display', '-moz-inline-stack']);
		}

		decs.push(['display', 'inline-block']);

		if (options.verticalAlign !== null) {
			decs.push(['vertical-align', options.verticalAlign || 'middle']);
		}

		if (config.ie < 8) {
			decs.push(['*vertical-align', 'auto']);
			decs.push(['zoom', '1']);
			decs.push(['*display', 'inline']);
		}

		return decs;
	});

	extender.args = arguments;
	return extender;
}

export = inlineBlock;
```

Now, that's a nice extender! Once you change your configuration to support newer browsers, the CSS hacks disappear. No need to change any of your source code. It's all about the configuration.

As with overrides, extenders are registered on the configuration object. If you wish to extend the configuration, you can do so by providing [a plugin module](#plugins).


#### Extender registration

It's important for you to know that, behind the scenes, blink is really smart about extender registration. It doesn't just register your extender by function name, but also by the arguments you pass in. This means if you extend `inlineBlock({ verticalAlign: 'top' })` 50 times and `inlineBlock({ verticalAlign: 'bottom' })` 20 times, only two rules will be generated. Different input yields different output, so it has to generate two rules for this scenario.


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

[Unlike Sass](http://thesassway.com/intermediate/responsive-web-design-in-sass-using-media-queries-in-sass-32), at the time of this writing, blink supports extenders inside of media queries. Blink also merges similar media queries for you. So feel free to go crazy with some complicated responders!


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

Since blink source code is written in [TypeScript][], you don't need to constantly look-up documentation to gain insight as to how you can use the blink API. Unfortunately, although there is [TypeScript][] support for [other editors][], you won't get the powerful feature of Intellisense unless you are using [Visual Studio][].

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


### Spriting

As blink is built on Node.js, any spriting tools available for Node.js can be implemented quite easily. Some of these tools, like [Spritesmith][] allow you to not only generate sprites, but compute off the dimensions of the source images that build the sprites. This makes your CSS highly maintainable. For example, when Design gives you replacement images all you should have to do is drop them in the sprites folder without changing a single line of your blink source.


## License

Released under the MIT license.

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/blinkjs/blink/trend.png)](https://bitdeli.com/free "Bitdeli Badge")



[Node.js]: http://nodejs.org/
[Node]: http://nodejs.org/
[BEM syntax]: http://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/
[MindBEMding &ndash; getting your head 'round BEM syntax]: http://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/
[TypeScript]: http://www.typescriptlang.org/
[other editors]: http://msopentech.com/blog/2012/10/01/sublime-text-vi-emacs-typescript-enabled/
[Visual Studio]: http://www.visualstudio.com/
[options]: https://github.com/blinkjs/blink/blob/master/lib/interfaces/IConfigurationOptions.ts
[stream]: http://nodejs.org/api/stream.html#stream_class_stream_readable
[err]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
[config]: https://github.com/blinkjs/blink/blob/master/lib/interfaces/IConfigurationOptions.ts
[file]: https://github.com/blinkjs/blink/blob/master/lib/interfaces/IFile.ts
[Rule]: https://github.com/blinkjs/blink/blob/master/lib/Rule.ts
[Sass]: http://sass-lang.com/
[Spritesmith]: https://github.com/Ensighten/spritesmith
