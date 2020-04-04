import * as glob from 'glob';
import * as upath from 'upath';
import * as fs from "fs";
import * as chalk from "chalk";
import { Stream } from "../core/common";
import { requireSafe } from './npm';

/** is: collection of type checking functions */
function _is(a: any, name: string) {
    return toString.call(a) === '[object ' + name + ']';
}

export const is = {
  Array:        (a:unknown): a is typeof a[] => Array.isArray(a),
  Object:       (a:unknown): a is object => a === Object(a),
  Arguments:    (a:unknown) => _is(a, 'Argument'),
  Function:     (a:unknown): a is Function => _is(a, 'Function'),
  String:       (a:unknown): a is string => _is(a, 'String'),
  Number:       (a:unknown): a is number => _is(a, 'Number'),
  Date:         (a:unknown): a is Date => _is(a, 'Date'),
  RegExp:       (a:unknown): a is RegExp  => _is(a, 'RegExp'),
  Error:        (a:unknown): a is Error => _is(a, 'Error'),
  Symbol:       (a:unknown): a is Symbol => _is(a, 'Symbol'),
  Map:          (a:unknown): a is typeof Map => _is(a, 'Map'),
  WeakMap:      (a:unknown): a is typeof WeakMap => _is(a, 'WeakMap'),
  Set:          (a:unknown): a is typeof Set => _is(a, 'Set'),
  WeakSet:      (a:unknown): a is typeof WeakSet => _is(a, 'WeakSet')
};

export function arrayify<T>(arg?: T | T[]): T[] {
    return arg ? (is.Array(arg) ? arg : [arg]) : [];
}


/**
 *  Add properties to object from directories
 *
 *  Usage examples:
 *  registerPropertiesFromFiles(obj, "./plugins") --> obj.xxx
 *  registerPropertiesFromFiles(obj.plugins={}, "./plugins") --> obj.plugins.xxx
*/
export function addProperty(obj: any, propName: string, propValue: any) {
    Object.defineProperty(obj, propName, {
        configurable: false,
        enumerable: true,
        get: propValue
    });
}

export function registerPropertiesFromFiles(obj: any, globPattern: string, callback?: (file: string) => string) {
    let files: string[] = [];
    let cb = callback ? callback : (file: string) => upath.removeExt(file, '.js');

    glob.sync(globPattern).forEach(file => files.push(cb(file)));
    files.forEach(file => addProperty(obj, upath.basename(file), () => require(file).default));
}

/** stream to promise */
export function toPromise(stream: Stream): Promise<Stream> {
    if (!stream) return Promise.resolve(stream);
    return requireSafe('stream-to-promise')(stream);
}


//** copy multi-glob files to single destination */
export function copy(patterns: string | string[], destPath: string): Promise<unknown> {
    patterns = arrayify(patterns);
    if (patterns.length === 0) return Promise.resolve();
    let promises: Promise<void>[] = [];

    // ensure destination directory exists
    if (!fs.existsSync(destPath)) fs.mkdirSync(destPath, { recursive: true });

    patterns.forEach(pattern => glob(pattern, (err: Error | null, files: string[]) =>
        files.forEach((file: string) => promises.push(new Promise((resolve, reject) => {
            const rd = fs.createReadStream(file).on('error', err => reject(err));
            const wr = fs.createWriteStream(upath.join(destPath, upath.basename(file)))
                .on('error', err => reject(err))
                .on('close', () => resolve());
            rd.pipe(wr);
        })))
    ));
    return Promise.all(promises);
}


//** load yml and json files
export function loadData(globPatterns: string | string[]): Object {
    if (is.String(globPatterns)) globPatterns = [globPatterns];
    let data = {};
    let yaml: any = undefined;
    globPatterns.forEach((globPattern: string) => {
        glob.sync(globPattern).forEach((file) => {
            let ext = upath.extname(file).toLowerCase();
            if (ext === '.yml' || ext === 'yaml') {
                if (!yaml) yaml = requireSafe('js-yaml');
                Object.assign(data, yaml.safeLoad(fs.readFileSync(file)));
            }
            else if (ext === '.json')
                Object.assign(data, JSON.parse(fs.readFileSync(file, 'utf-8')));
            else
                throw Error(`Unknown data file extension: ${ext}`);
        });
    });
    return data;
}

export let wait = (msec: number) => new Promise(resolve => setTimeout(resolve, msec));

export function dmsg(...args: any[]) {
    let [arg1, ...arg2] = args; // decompose to seperate object priting
    console.log(arg1); if (arg2.length > 0) console.log(...arg2);
}

export function msg(...args: any[]) {
    console.log(...args);
}

export function info(...args: any[]) {
    console.log(chalk.green(...args));
}

export function notice(...args: any[]) {
    console.log(chalk.yellow(...args));
}

export function warn(...args: any[]) {
    console.log(chalk.redBright(...args));
}

export * from './process';
export * from './npm';
