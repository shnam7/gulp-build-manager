"use strict";
// ref: https://github.com/pbardov/es6-mutex
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mutex = exports.Semaphore = void 0;
const events_1 = require("events");
class Semaphore extends events_1.EventEmitter {
    constructor(max = 1, maxConsumers = 100) {
        super();
        this._n = 0; // # of currently allowed accesses
        this._max = 1; // # of maximum concurrent access
        this._max = max;
        this.setMaxListeners(maxConsumers);
    }
    onRelease() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => { this.once('release', resolve); });
        });
    }
    onAcquire() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => { this.once('acquire', resolve); });
        });
    }
    acquire() {
        return __awaiter(this, void 0, void 0, function* () {
            while (this._n >= this._max)
                yield this.onRelease();
            this.emit('acquire', ++this._n);
        });
    }
    release() {
        this.emit('release', --this._n);
    }
}
exports.Semaphore = Semaphore;
class Mutex extends Semaphore {
    constructor(maxClients = 100) {
        super(1, maxClients);
    }
    lock() { return this.acquire(); }
    unlock() { this.release(); }
}
exports.Mutex = Mutex;
