/// <reference path="../bower_components/dt-node/node.d.ts" />
import events = require('events');
declare class Logger extends events.EventEmitter {
    debug(message: string): void;
    info(message: string): void;
    warn(message: string): void;
    error(err: Error): void;
}
export = Logger;
