/// <reference path="./bower_components/dt-vinyl/vinyl.d.ts" />
declare module "blink" {
	var config: Configuration;
	function compile(options?: ConfigurationOptions): NodeJS.ReadWriteStream;
	class Configuration extends ConfigurationForBrowser implements ConfigurationOptions {
		constructor(options?: ConfigurationOptions);
		private loadConfig(filename);
		public newline: string;
	}
	class ConfigurationForBrowser implements ConfigurationOptions {
		constructor(options?: ConfigurationOptions);
		public loadPlugins(options?: ConfigurationOptions): any;
		public clone(): Configuration;
		public set(options: ConfigurationOptions): Configuration;
		public raw: ConfigurationOptions;
		public toString(): string;
		/**
		 * The location of the config file
		 */
		public config: string;
		public quiet: boolean;
		public trace: boolean;
		public force: boolean;
		public boring: boolean;
		public style: string;
		public oneIndent: any;
		public newline: string;
		public quote: string;
		public oneSpace: string;
		public declarationSeparator: string;
		public ruleSeparator: any;
		public block: string;
		public element: string;
		public modifier: string;
		public chrome: number;
		public firefox: number;
		public ie: number;
		public opera: number;
		public safari: number;
		public android: number;
		public firefoxMobile: number;
		public ieMobile: number;
		public operaMobile: number;
		public safariMobile: number;
		public webkitPrefix: boolean;
		public khtmlPrefix: boolean;
		public mozPrefix: boolean;
		public msPrefix: boolean;
		public oPrefix: boolean;
		public extenders: Extenders;
		public overrides: Overrides;
	}
	interface BackgroundOptions {
		color?: string;
		image?: string;
		repeat?: string;
		attachment?: string;
		position?: any;
	}
	interface ConfigurationOptions {
		/**
		* Specify location of config file.
		*/
		config?: string;
		/**
		* Extend configuration with these plugins.
		*/
		plugins?: string[];
		/**
		* Quiet mode.
		*/
		quiet?: boolean;
		/**
		* Show a full stacktrace on error.
		*/
		trace?: boolean;
		/**
		* Overwrites existing files.
		*/
		force?: boolean;
		/**
		* Turn off colorized output.
		*/
		boring?: boolean;
		/**
		* Output style: nested (default), expanded, compact, compressed.
		*/
		style?: string;
		/**
		* One indent: 2s (default), 4s, 1t.
		*/
		oneIndent?: string;
		/**
		* Quote type: double (default), single.
		*/
		quote?: string;
		/**
		* Newline: os (default), lf, crlf.
		*/
		newline?: string;
		/**
		* BEM block format: .%s (default).
		*/
		block?: string;
		/**
		* BEM element format: __%s (default).
		*/
		element?: string;
		/**
		* BEM modifier format: --%s (default).
		*/
		modifier?: string;
		/**
		* Minimum Chrome version supported: 0 (default)
		*/
		chrome?: number;
		/**
		* Minimum Firefox (Gecko) version supported: 0 (default)
		*/
		firefox?: number;
		/**
		* Minimum IE version supported: 0 (default)
		*/
		ie?: number;
		/**
		* Minimum Opera version supported: 0 (default)
		*/
		opera?: number;
		/**
		* Minimum Safari version supported: 0 (default)
		*/
		safari?: number;
		/**
		* Minimum Android version supported: 0 (default)
		*/
		android?: number;
		/**
		* Minimum Firefox Mobile (Gecko) version supported: 0 (default)
		*/
		firefoxMobile?: number;
		/**
		* Minimum IE Phone version supported: 0 (default)
		*/
		ieMobile?: number;
		/**
		* Minimum Opera Mobile version supported: 0 (default)
		*/
		operaMobile?: number;
		/**
		* Minimum Safari Mobile version supported: 0 (default)
		*/
		safariMobile?: number;
		/**
		* Enable experimental -webkit- prefix: true (default)
		*/
		webkitPrefix?: boolean;
		/**
		* Enable experimental -khtml- prefix: false (default)
		*/
		khtmlPrefix?: boolean;
		/**
		* Enable experimental -moz- prefix: true (default)
		*/
		mozPrefix?: boolean;
		/**
		* Enable experimental -ms- prefix: true (default)
		*/
		msPrefix?: boolean;
		/**
		* Enable experimental -o- prefix: true (default)
		*/
		oPrefix?: boolean;
	}
	interface Extenders {
		background: any;
		experimental: any;
		font: any;
		inlineBlock: any;
	}
	interface Overrides {
		appearance: any;
		background: any;
		box: any;
		boxSizing: any;
		clearfix: any;
		display: any;
		font: any;
		opacity: any;
		text: any;
		textSizeAdjust: any;
	}
	class Compiler extends CompilerBrowser {
		public config: Configuration;
		constructor(config?: Configuration);
		public compile(): NodeJS.ReadWriteStream;
		private renameExtToCss(file);
		private compileBuffer(data, filepath, callback);
	}
	class CompilerBrowser {
		public config: Configuration;
		constructor(config?: Configuration);
		public compile(contents: string, callback: (err: Error, css?: string) => void): void;
		public compileRules(rules: Rule[], callback: (err: Error, css?: string) => void): void;
		public resolveRules(rules: Rule[]): any[];
		private format(rules);
		private resolveExtenders(rules);
		private registerExtenders(extenders, rules);
		private resolveResponders(responders);
		private registerResponders(registry, selectors, responders);
		private resolveTree(tree);
	}
	class Rule {
		public body: RuleBody;
		private config;
		private decs;
		public extenders: any[];
		public includes: Function[];
		public responders: MediaAtRule[];
		private _selectors;
		public selectors: any;
		constructor(selectors: any, body?: RuleBody);
		private splitSelectors(selectors);
		public resolve(config: Configuration): any[];
		private joinSelectors(left, right);
		public clone(): Rule;
		private resolveIncludes();
		private resolveBody(seed, key, body);
		private combineKeys(k1, k2);
		private isDeclarationValue(value);
		private compileDeclarationValue(value);
		private compileArray(arr);
		private compilePrimitive(value);
		public compile(config: Configuration): string;
	}
	interface RuleBody extends HashTable<any> {
		extend?: any[];
		include?: Function[];
		respond?: MediaAtRule[];
	}
	class MediaAtRule extends Rule {
		public condition: string;
		public body: RuleBody;
		constructor(condition: string, body?: RuleBody);
	}
	interface HashTable<T> {
		[key: string]: T;
	}
	class Block {
		public name: string;
		public body: BlockBody;
		public elements: Element[];
		public modifiers: Modifier[];
		constructor(name: string, body?: BlockBody);
		public resolve(config: Configuration): any[];
	}
	interface BlockBody extends RuleBody {
		elements?: Element[];
		modifiers?: Modifier[];
	}
	class Modifier {
		public name: string;
		public body: ModifierBody;
		public elements: Element[];
		constructor(name: string, body?: ModifierBody);
		public resolve(base: string, config: Configuration): any[];
	}
	interface ModifierBody extends RuleBody {
		elements?: Element[];
	}
	class Element {
		public name: string;
		public body: ElementBody;
		public modifiers: Modifier[];
		constructor(name: string, body?: ElementBody);
		public resolve(base: string, config: Configuration): any[];
	}
	interface ElementBody extends RuleBody {
		modifiers?: Modifier[];
	}
	interface Extender {
		args: IArguments;
		selectors?: string[];
		(config?: Configuration): any[][];
	}
	interface Override extends Extender {
	}
}
