import events = require('events');
declare class Logger extends events.EventEmitter {
    public debug(message: string): void;
    public info(message: string): void;
    public warn(message: string): void;
    public error(err: Error): void;
}
export = Logger;
