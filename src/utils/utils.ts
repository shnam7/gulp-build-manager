import * as glob from 'glob';
import * as upath from 'upath';
import {GulpStream, Stream} from "../core/types";

// export function removeExt(fileName: string, ext: string) {
//   if (!ext) return fileName;
//   ext = (ext[0] === '.') ? ext : '.' + ext;
//   return (fileName.slice(-ext.length) === ext) ? fileName.slice(0, -ext.length) : fileName;
// }


/** pick */
export function pick<T, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K> {
  const ret: any = {};
  keys.forEach(key => {
    ret[key] = obj[key];
  });
  return ret;
}

/** is: collection of type checking functions */
function _is(a:any, name:string) {
  return toString.call(a) === '[object ' + name + ']';
}

export const is = {
  Array:        (a:any) => Array.isArray(a),
  Object:       (a:any) => a === Object(a),
  Arguments:    (a:any) => _is(a, 'Argument'),
  Function:     (a:any) => _is(a, 'Function'),
  String:       (a:any) => _is(a, 'String'),
  Number:       (a:any) => _is(a, 'Number'),
  Date:         (a:any) => _is(a, 'Date'),
  RegExp:       (a:any) => _is(a, 'RegExp'),
  Error:        (a:any) => _is(a, 'Error'),
  Symbol:       (a:any) => _is(a, 'Symbol'),
  Map:          (a:any) => _is(a, 'Map'),
  WeakMap:      (a:any) => _is(a, 'WeakMap'),
  Set:          (a:any) => _is(a, 'Set'),
  WeakSet:      (a:any) => _is(a, 'WeakSet')
};

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

export function registerPropertiesFromFiles(obj: any, globPattern: string, callback?:(file:string)=>string ) {
  let files: string[] = [];
  let cb = callback ? callback : (file:string)=>upath.removeExt(file, '.js');

  glob.sync(globPattern).forEach(file => files.push(cb(file)));
  files.forEach(file=>addProperty(obj, upath.basename(file), ()=>require(file).default));
}

/** stream to promise */
export function toPromise(stream: Stream): Promise<Stream> {
  if (!stream) return Promise.resolve(stream);
  return new Promise<Stream>((resolve, reject) => {
    return stream
      .on('end', ()=>resolve(stream))       // event for read stream
      .on('finish', ()=>resolve(stream))    // event for write stream
      // .on('end', ()=>{console.log('read stream end'); resolve(stream)})       // event for read stream
      // .on('finish', ()=>{console.log('write stream finish'); resolve(stream)})       // event for write stream
      .on('error', reject)
      // .resume()
  })
}

export let wait = (msec: number) => new Promise(res => setTimeout(res, msec));

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
//       console.log(chalk.yellow(`** Installing node package:${moduleName}...`));
//       promise = npmInstall(moduleName);
//     }
//     errorCount = 0;
//   }
// }