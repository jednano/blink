///<reference path="../bower_components/dt-node/node.d.ts" />
import events = require('events');


class Logger extends events.EventEmitter {

	public debug(message: string) {
		this.emit('debug', message);
	}

	public info(message: string) {
		this.emit('info', message);
	}

	public warn(message: string) {
		this.emit('warn', message);
	}

	public error(err: Error) {
		this.emit('error', err);
	}

}

export = Logger;
