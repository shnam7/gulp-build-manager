// ref: https://github.com/pbardov/es6-mutex

const { EventEmitter } = require('events');

export class Semaphore extends EventEmitter {
    protected _n = 0;
    protected _max = 1;

    constructor(max: number = 1, maxConsumers = 100) {
        super();
        this._max = max;
        this.setMaxListeners(maxConsumers);
    }

    protected async onRelease(): Promise<unknown> {
        return new Promise(resolve => { this.once('release', resolve); });
    }

    protected async onAcquire(): Promise<unknown> {
        return new Promise(resolve => { this.once('acquire', resolve); });
    }

    async acquire(): Promise<void> {
        while (this._n >= this._max) {
            await this.onRelease();
        }
        this._n++;
        this.emit('acquire', this._n);
    }

    release() {
        this._n -= 1;
        this.emit('release', this._n);
    }
}

export class Mutex extends Semaphore {
    constructor(maxClients = 100) {
        super(1, maxClients);
    }

    lock() { return this.acquire(); }
    unlock() { return this.release(); }
}
