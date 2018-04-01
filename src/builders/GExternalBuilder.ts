/**
 *  Jekyll Builder
 */
import {Options, Stream} from "../core/types";
import {GBuilder} from "../core/builder";
import {SpawnOptions} from "child_process";

export class GExternalBuilder extends GBuilder {
  constructor(public command:string, public args:string[]=[], public options:SpawnOptions={}) { super(); }

  // overload not to create a stream
  OnInitStream(mopts:Options, defaultModuleOptions:Options, conf:Options) { return undefined; }

  OnBuild(stream:Stream, mopts:Options, conf:Options) {
    const logger = (data: Buffer) => data.toString('utf-8')
      .split(/[\n\r]+/)
      .filter(line => line !== '')
      .forEach((message: string) => console.log(`[buildName:${conf.buildName}]: ${message}`));

    let spawnOptions = this.options;
    if (!spawnOptions.shell) spawnOptions.shell = true;
    if (process.platform.startsWith('win') && !spawnOptions.stdio) spawnOptions.stdio = 'pipe';

    const proc = require('child_process').spawn(this.command, this.args, this.options);
    proc.stdout.on('data', logger);
    proc.stderr.on('data', logger);
    proc.stdout.emit('data', `Starting external process:command="${this.command}" `
      + `args="${this.args ? this.args.join(' ') : ''}" options=${JSON.stringify(this.options)}`);

    const err = new Error(`Running "${this.command} ${this.args.join(' ')}" returned error code `);
    let promise = new Promise<void>((resolve, reject) => {
      proc.on('exit', (code: number, signal: string) => {
        console.log(`External process for <buildName:${conf.buildName}> finished(exit code:${code})`);
        if (code) {
          reject(err);
        } else {
          resolve();
        }
      })
    }).then(()=>{this.reload(stream, conf, mopts)});

    if (conf.flushStream) this.promises.push(promise);
    return stream;
  }
}

export default GExternalBuilder;