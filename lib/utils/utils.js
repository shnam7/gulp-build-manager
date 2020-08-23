"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.warn = exports.notice = exports.info = exports.msg = exports.dmsg = exports.wait = exports.loadData = exports.copy = exports.registerPropertiesFromFiles = exports.addProperty = exports.arrayify = exports.is = void 0;
const glob = require("glob");
const upath = require("upath");
const fs = require("fs");
const chalk = require("chalk");
const npm_1 = require("./npm");
/** is: collection of type checking functions */
function _is(a, name) {
    return toString.call(a) === '[object ' + name + ']';
}
exports.is = {
    Array: (a) => Array.isArray(a),
    Object: (a) => a === Object(a),
    Arguments: (a) => _is(a, 'Argument'),
    Function: (a) => _is(a, 'Function'),
    String: (a) => _is(a, 'String'),
    Number: (a) => _is(a, 'Number'),
    Date: (a) => _is(a, 'Date'),
    RegExp: (a) => _is(a, 'RegExp'),
    Error: (a) => _is(a, 'Error'),
    Symbol: (a) => _is(a, 'Symbol'),
    Map: (a) => _is(a, 'Map'),
    WeakMap: (a) => _is(a, 'WeakMap'),
    Set: (a) => _is(a, 'Set'),
    WeakSet: (a) => _is(a, 'WeakSet')
};
function arrayify(arg) {
    return arg ? (exports.is.Array(arg) ? arg : [arg]) : [];
}
exports.arrayify = arrayify;
/**
 *  Add properties to object from directories
 *
 *  Usage examples:
 *  registerPropertiesFromFiles(obj, "./plugins") --> obj.xxx
 *  registerPropertiesFromFiles(obj.plugins={}, "./plugins") --> obj.plugins.xxx
*/
function addProperty(obj, propName, propValue) {
    Object.defineProperty(obj, propName, {
        configurable: false,
        enumerable: true,
        get: propValue
    });
}
exports.addProperty = addProperty;
function registerPropertiesFromFiles(obj, globPattern, callback) {
    let files = [];
    let cb = callback ? callback : (file) => upath.removeExt(file, '.js');
    glob.sync(globPattern).forEach(file => files.push(cb(file)));
    files.forEach(file => addProperty(obj, upath.basename(file), () => require(file).default));
}
exports.registerPropertiesFromFiles = registerPropertiesFromFiles;
//** copy multi-glob files to single destination */
function copy(patterns, destPath) {
    patterns = arrayify(patterns);
    if (patterns.length === 0)
        return Promise.resolve();
    let promises = [];
    // ensure destination directory exists
    if (!fs.existsSync(destPath))
        fs.mkdirSync(destPath, { recursive: true });
    patterns.forEach(pattern => glob(pattern, (err, files) => files.forEach((file) => promises.push(new Promise((resolve, reject) => {
        const rd = fs.createReadStream(file).on('error', err => reject(err));
        const wr = fs.createWriteStream(upath.join(destPath, upath.basename(file)))
            .on('error', err => reject(err))
            .on('close', () => resolve());
        rd.pipe(wr);
    })))));
    return Promise.all(promises);
}
exports.copy = copy;
//** load yml and json files
function loadData(globPatterns) {
    if (exports.is.String(globPatterns))
        globPatterns = [globPatterns];
    let data = {};
    let yaml = undefined;
    globPatterns.forEach((globPattern) => {
        glob.sync(globPattern).forEach((file) => {
            let ext = upath.extname(file).toLowerCase();
            if (ext === '.yml' || ext === '.yaml') {
                if (!yaml)
                    yaml = npm_1.requireSafe('js-yaml');
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
exports.loadData = loadData;
exports.wait = (msec) => new Promise(resolve => setTimeout(resolve, msec));
function dmsg(...args) {
    let [arg1, ...arg2] = args; // decompose to seperate object priting
    console.log(arg1);
    if (arg2.length > 0)
        console.log(...arg2);
}
exports.dmsg = dmsg;
function msg(...args) {
    console.log(...args);
}
exports.msg = msg;
function info(...args) {
    console.log(chalk.green(...args));
}
exports.info = info;
function notice(...args) {
    console.log(chalk.yellow(...args));
}
exports.notice = notice;
function warn(...args) {
    console.log(chalk.redBright(...args));
}
exports.warn = warn;
__exportStar(require("./process"), exports);
__exportStar(require("./npm"), exports);
