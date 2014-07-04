/// <reference path="./bower_components/dt-node/node.d.ts" />

declare module "blink" {
	var config: Configuration;
	class Configuration implements IConfigurationOptions {
		constructor(options?: IConfigurationOptions);
		private extendPlugins(options?: IConfigurationOptions): any;
		public clone(): Configuration;
		public set(options: IConfigurationOptions): Configuration;
		private loadConfig(filename);
		public raw: IConfigurationOptions;
		public toString(): string;
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
		public webkitPrefix: boolean;
		public khtmlPrefix: boolean;
		public mozPrefix: boolean;
		public msPrefix: boolean;
		public oPrefix: boolean;
		public overrides: any;
	}
	function compile(options: IConfigurationOptions, files: IFiles,
		callback: (err: Error, config: Configuration, file: IFile) => void): void;
	interface IFile {
		src?: string;
		dest?: string;
		contents?: string;
	}
	interface IFiles {
		src: string[];
		dest: string;
	}
	class Rule {
		public body: IRuleBody;
		private config;
		private decs;
		public extenders: any[];
		public includes: Function[];
		public responders: MediaAtRule[];
		private _selectors;
		public selectors: any;
		constructor(selectors: any, body?: IRuleBody);
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
	class Block {
		public name: string;
		public body: IBlockBody;
		public elements: Element[];
		public modifiers: Modifier[];
		constructor(name: string, body?: IBlockBody);
		public resolve(config: Configuration): any[];
	}
	class Compiler {
		public config: Configuration;
		constructor(config?: Configuration);
		public compile(files: IFiles,
			callback: (err: Error, file?: IFile) => void): void;
		private tryCompileRule(rule, callback);
		private compileFile(file, callback);
		public compileStream(stream: NodeJS.ReadableStream,
			callback: (err: Error, file?: IFile) => void): void;
		private readStream(stream, callback);
		public tryCompileContents(file: IFile,
			callback: (err: Error, file?: IFile) => void): void;
		private renameExtToCss(file);
		private compileModule(contents, folder);
		public compileRules(rules: Rule[]): string;
		public resolveRules(rules: Rule[]): any[];
		private format(rules);
		private resolveExtenders(rules);
		private registerExtenders(extenders, rules);
		private resolveResponders(responders);
		private registerResponders(registry, selectors, responders);
		private resolveTree(tree);
	}
	class Element {
		public name: string;
		public body: IElementBody;
		public modifiers: Modifier[];
		constructor(name: string, body?: IElementBody);
		public resolve(base: string, config: Configuration): any[];
	}
	class MediaAtRule extends Rule {
		public condition: string;
		public body: IRuleBody;
		constructor(condition: string, body?: IRuleBody);
	}
	class Modifier {
		public name: string;
		public body: IModifierBody;
		public elements: Element[];
		constructor(name: string, body?: IModifierBody);
		public resolve(base: string, config: Configuration): any[];
	}
	interface IConfigurationOptions {
		config?: string;
		plugins?: string[];
		quiet?: boolean;
		trace?: boolean;
		force?: boolean;
		boring?: boolean;
		style?: string;
		oneIndent?: string;
		quote?: string;
		newline?: string;
		block?: string;
		element?: string;
		modifier?: string;
		chrome?: number;
		firefox?: number;
		ie?: number;
		opera?: number;
		webkitPrefix?: boolean;
		khtmlPrefix?: boolean;
		mozPrefix?: boolean;
		msPrefix?: boolean;
		oPrefix?: boolean;
	}
	interface IBlockBody extends IRuleBody {
		elements?: Element[];
		modifiers?: Modifier[];
	}
	interface IElementBody extends IRuleBody {
		modifiers?: Modifier[];
	}
	interface IModifierBody extends IRuleBody {
		elements?: Element[];
	}
	interface IRuleBody extends IHashTable<any> {
		extend?: any[];
		include?: Function[];
		respond?: MediaAtRule[];
	}
	interface IHashTable<T> {
		[key: string]: T;
	}
}
