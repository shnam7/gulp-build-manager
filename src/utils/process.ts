/**
 *  This code referenced angular-cli (https://github.com/angular/angular-cli)
 */

import * as child_process from 'child_process';
import chalk from 'chalk';

export interface SpawnOptions extends child_process.SpawnOptions {
  // spawn?: SpawnOptions;
  stopOnMatch?: RegExp;
  silent?: boolean;
  captureOutput?: boolean;
}

export type ProcessOutput = {
  stdout: string;
  stderr: string;
}

export function spawn(cmd: string, args: string[]=[], options: SpawnOptions={}): Promise<ProcessOutput> {
  let stdout = '';
  let stderr = '';
  const cwd = process.cwd();

  args = args.filter(x => x !== undefined);
  const flags = [
    options.silent && 'silent',
    options.stopOnMatch && `matching(${options.stopOnMatch})`
  ]
    .filter(x => !!x)  // Remove false and undefined.
    .join(', ')
    .replace(/^(.+)$/, ' [$1]');  // Proper formatting.

  if (!options.silent) {
    console.log(chalk.blue(`Running \`${cmd} ${args.join(' ')}\`${flags}...`));
    console.log(chalk.blue(`CWD: ${cwd}`));
  }
  // const spawnOptions: SpawnOptions = options.spawn || {shell: true};
  const spawnOptions: SpawnOptions = Object.assign({}, options);
  if (!spawnOptions.cwd) spawnOptions.cwd = cwd;

  if (process.platform.startsWith('win')) {
    // args.unshift('/c', cmd);
    // cmd = 'cmd.exe';
    if (!spawnOptions.stdio) spawnOptions['stdio'] = 'pipe';
  }

  const childProcess = child_process.spawn(cmd, args, spawnOptions);

  childProcess.stdout.on('data', (data: Buffer) => {
    if (options.captureOutput) stdout += data.toString('utf-8');
    if (options.silent) return;
    data.toString('utf-8')
      .split(/[\n\r]+/)
      .filter(line => line !== '')
      .forEach(line => console.log('  ' + line));
  });
  childProcess.stderr.on('data', (data: Buffer) => {
    if (options.captureOutput) stderr += data.toString('utf-8');
    if (options.silent) return;
    data.toString('utf-8')
      .split(/[\n\r]+/)
      .filter(line => line !== '')
      .forEach(line => console.error(chalk.yellow('  ' + line)));
  });

  // Create the error here so the stack shows who called this function.
  const err = new Error(`Running "${cmd} ${args.join(' ')}" returned error code `);
  return new Promise((resolve, reject) => {
    childProcess.on('exit', (error: any) => {
      if (error) {
        // err.message += `${error}...\n\nSTDOUT:\n${stdout}\n\nSTDERR:\n${stderr}\n`;
        reject(err);
      } else {
        resolve({stdout, stderr});
      }
    });
    if (options.stopOnMatch) {
      childProcess.stdout.on('data', (data: Buffer) => {
        if (data.toString().match(options.stopOnMatch as RegExp)) {
          resolve({ stdout, stderr });
        }
      });
      childProcess.stderr.on('data', (data: Buffer) => {
        if (data.toString().match(options.stopOnMatch as RegExp)) {
          resolve({ stdout, stderr });
        }
      });
    }
  });
}

export function exec(cmd: string, args: string[]=[], options: SpawnOptions={}): Promise<ProcessOutput> {
  let opts = Object.assign({}, options);
  if (opts.shell === undefined) opts.shell = true;
  return spawn(cmd, args, opts);
}


// export function npm(args: string[], options: SpawnOptions={silent: true}) {
//   return exec('npm', args);
// }
//
// export function npmInstall(packageName:string, silent:boolean = false) {
//   return exec('npm', ['i', packageName], {silent: silent});
// }
//
// export function node(args: string[]) {
//   return exec('node', args);
// }
//
// export function gulp(args: string[]) {
//   return exec('gulp', args);
// }
//
// export function which(command: string): Promise<string> {
//   let whichCmd = process.platform === 'win32' ? 'where' : 'which';
//   return exec(whichCmd,[command],{silent: true, captureOutput: true})
//     .then((res)=>res.stdout);
// }
