// ref: https://github.com/pbardov/es6-mutex

import { EventEmitter } from 'events';

export class Semaphore extends EventEmitter {
    protected _n = 0;       // # of currently allowed accesses
    protected _max = 1;     // # of maximum concurrent access

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
        while (this._n >= this._max) await this.onRelease();
        this.emit('acquire', ++this._n);
    }

    release(): void {
        this.emit('release', --this._n);
    }
}

export class Mutex extends Semaphore {
    constructor(maxClients = 100) {
        super(1, maxClients);
    }

    lock(): Promise<unknown> { return this.acquire(); }
    unlock(): void { this.release(); }
}
