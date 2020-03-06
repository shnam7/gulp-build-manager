import * as glob from 'glob';
import * as upath from 'upath';
import {Stream} from "../core/common";
import * as fs from "fs";
import * as chalk from "chalk";

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

export function arrayify<T>(arg?: T | T[]) {
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
    return new Promise<Stream>((resolve, reject) => {
        return stream
            .on('end', () => resolve(stream))       // event for read stream
            .on('finish', () => resolve(stream))    // event for write stream
            // .on('end', ()=>{dmsg('read stream end'); resolve(stream)})       // event for read stream
            // .on('finish', ()=>{dmsg('write stream finish'); resolve(stream)})       // event for write stream
            .on('error', reject)
        // .resume()
    })
}

//** load yml and json files
export function loadData(globPatterns: string | string[]): Object {
    if (is.String(globPatterns)) globPatterns = [globPatterns];
    let data = {};
    globPatterns.forEach((globPattern: string) => {
        glob.sync(globPattern).forEach((file) => {
            let ext = upath.extname(file).toLowerCase();
            if (ext === '.yml' || ext === 'yaml')
                Object.assign(data, require('js-yaml').safeLoad(fs.readFileSync(file)));
            else if (ext === '.json')
                Object.assign(data, JSON.parse(fs.readFileSync(file, 'utf-8')));
            else
                throw Error(`Unknown data file extension: ${ext}`);
        });
    });
    return data;
}

export let wait = (msec: number) => new Promise(resolve => setTimeout(() => resolve(), msec));
// export let wait = (msec: number) => new Promise(resolve => setTimeout(()=>{
//     console.log('ms=' + msec); resolve()}, msec));

// export function npmInstallGuard(func:()=>void, options: Options={}) {
//   let errorCount = 0;
//   let promise = new Promise<void>((res)=>res());  // initially resolved promise
//   while (true) {
//     try {
//       promise.then(func);
//       break;  // exit loop if no exception occurred
//     }
//     catch (e) {
//       if (e.code !== 'MODULE_NOT_FOUND') throw e;
//       if (errorCount++ === 1) throw e;  // just try installation once
//       let moduleName = e.message.slice(e.message.indexOf("'")+1, e.message.lastIndexOf("'"));
//       if (moduleName.startsWith('.')) throw e;  // not referring to node_modules
//       msg(`** Installing node package:${moduleName}...`);
//       promise = npmInstall(moduleName);
//     }
//     errorCount = 0;
//   }
// }

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
    console.log(chalk.red(...args));
}

export * from './process';
