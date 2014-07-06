import IExtender = require('./interfaces/IExtender');
import IHashTable = require('./interfaces/IHashTable');


class ExtenderRegistry {

	private extenders: IHashTable<IExtender> = {};
	private selectors: IHashTable<string[]> = {};

	public add(extender: IExtender, selectors: string[]) {
		var key = this.createKey(extender);
		if (!this.extenders.hasOwnProperty(key)) {
			this.extenders[key] = extender;
			this.selectors[key] = [];
		}
		Array.prototype.push.apply(this.selectors[key], selectors);
	}

	private createKey(extender: IExtender) {
		var args = extender.args;
		var extenderName = (<any>args.callee).name;
		var serializedArgs = JSON.stringify(Array.prototype.slice.call(args, 0));
		return extenderName + serializedArgs;
	}

	public forEach(callback: (extender: IExtender, selectors: string[]) => void) {
		Object.keys(this.extenders).forEach(key => {
			callback(this.extenders[key], this.selectors[key]);
		});
	}

	public map(callback: (extender: IExtender, selectors: string[]) => void) {
		var result = [];
		this.forEach((extender, selectors) => {
			result.push(callback(extender, selectors));
		});
		return result;
	}

}

export = ExtenderRegistry;
