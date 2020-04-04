/**
 *  This code referenced angular-cli (https://github.com/angular/angular-cli)
 */

import * as child_process from 'child_process';
import { msg, notice, is } from "./utils";

export interface SpawnOptions extends child_process.SpawnOptions {
    // spawn?: SpawnOptions;
    stopOnMatch?: RegExp;
    silent?: boolean;
    verbose?: boolean;
    captureOutput?: boolean;
}

export type ProcessOutput = {
    stdout: string;
    stderr: string;
}

export interface ExternalCommand {
    command: string,
    args?: string[];
    options?: SpawnOptions;
}


export function spawn(cmd: string, args: string[] = [], options: SpawnOptions = {}): Promise<ProcessOutput> {
    const cwd = process.cwd();

    args = args.filter(x => x !== undefined);
    const flags = [options.silent && 'silent']
        .filter(x => !!x)  // Remove false and undefined.
        .join(', ').replace(/^(.+)$/, ' [$1]');  // Proper formatting.

    if (options.verbose) {
        msg(`Running \`${cmd} ${args.join(' ')}\`${flags}...`);
        msg(`CWD: ${cwd}`);
    }

    const spawnOptions: SpawnOptions = Object.assign({ shell: true, stdio: 'pipe'}, options);
    const childProcess = child_process.spawn(cmd, args, spawnOptions);

    // utf8 is default
    // childProcess.stdout!.setEncoding('utf8');
    // childProcess.stderr!.setEncoding('utf8');
    if (childProcess.stdout) childProcess.stdout.on('data', (data) => !options.silent && console.log(data.toString()));
    if (childProcess.stderr) childProcess.stderr.on('data', (data) => !options.silent &&console.log(data.toString()));

    const err = new Error(`Running "${cmd} ${args.join(' ')}" returned error code `);
    return new Promise((resolve, reject) => {
        childProcess.on('exit', (error: any) => { if (error) reject(err); else resolve(); });
    });
}

export function exec(cmd: string | ExternalCommand, args: string[] = [], options: SpawnOptions = {}): Promise<ProcessOutput> {
    if (is.Object(cmd)) {
        args = cmd.args || [];
        options = cmd.options || {};
        cmd = cmd.command;
    }

    let opts = Object.assign({shell: true}, options);
    return spawn(cmd, args, opts);
}
