import IHashTable = require('./interfaces/IHashTable');


class ExtenderRegistry {

	private extenders: IHashTable<Function> = {};
	private selectors: IHashTable<string[]> = {};

	public add(extender: Function, args: IArguments, selectors: string[]) {
		var key = this.createKey(extender, args);
		if (!this.extenders.hasOwnProperty(key)) {
			this.extenders[key] = extender;
			this.selectors[key] = [];
		}
		Array.prototype.push.apply(this.selectors[key], selectors);
	}

	private createKey(extender: Function, args: IArguments) {
		var extenderName = (<any>args.callee).name;
		var serializedArgs = JSON.stringify(Array.prototype.slice.call(args, 0));
		return extenderName + serializedArgs;
	}

	public forEach(callback: (extender: Function, selectors: string[]) => void) {
		Object.keys(this.extenders).forEach(key => {
			callback(this.extenders[key], this.selectors[key]);
		});
	}

	public map(callback: (extender: Function, selectors: string[]) => void) {
		var result = [];
		this.forEach((extender, selectors) => {
			result.push(callback(extender, selectors));
		});
		return result;
	}

}

export = ExtenderRegistry;
