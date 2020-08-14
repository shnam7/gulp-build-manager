"use strict";
/**
 *  This code referenced angular-cli (https://github.com/angular/angular-cli)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.exec = exports.spawn = void 0;
const child_process = require("child_process");
const utils_1 = require("./utils");
function spawn(cmd, args = [], options = {}) {
    const cwd = process.cwd();
    args = args.filter(x => x !== undefined);
    const flags = [options.silent && 'silent']
        .filter(x => !!x) // Remove false and undefined.
        .join(', ').replace(/^(.+)$/, ' [$1]'); // Proper formatting.
    if (options.verbose) {
        utils_1.msg(`Running \`${cmd} ${args.join(' ')}\`${flags}...`);
        utils_1.msg(`CWD: ${cwd}`);
    }
    const spawnOptions = Object.assign({ shell: true, stdio: 'pipe' }, options);
    const childProcess = child_process.spawn(cmd, args, spawnOptions);
    // utf8 is default
    // childProcess.stdout!.setEncoding('utf8');
    // childProcess.stderr!.setEncoding('utf8');
    if (childProcess.stdout)
        childProcess.stdout.on('data', (data) => !options.silent && console.log(data.toString()));
    if (childProcess.stderr)
        childProcess.stderr.on('data', (data) => !options.silent && console.log(data.toString()));
    const err = new Error(`Running "${cmd} ${args.join(' ')}" returned error code `);
    return new Promise((resolve, reject) => {
        childProcess.on('exit', (error) => { if (error)
            reject(err);
        else
            resolve(); });
    });
}
exports.spawn = spawn;
function exec(cmd, args = [], options = {}) {
    if (utils_1.is.Object(cmd)) {
        args = cmd.args || [];
        options = cmd.options || {};
        cmd = cmd.command;
    }
    let opts = Object.assign({ shell: true }, options);
    return spawn(cmd, args, opts);
}
exports.exec = exec;
