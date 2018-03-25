/**
 *  Jekyll Builder
 */
import {Options, Stream} from "../core/types";
import {GBuilder} from "../core/builder";
import {SpawnOptions} from "child_process";
import {encode} from "punycode";

export class GExternalBuilder extends GBuilder {
  constructor(public command:string, public args:string[]=[], public options:SpawnOptions={}) { super(); }

  // overload not to create a stream
  OnInitStream(mopts:Options, defaultModuleOptions:Options, conf:Options) { return undefined; }

  OnBuild(stream:Stream, mopts:Options, conf:Options) {
    const proc = require('child_process').spawn(this.command, this.args, this.options);
    const logger = (buffer:any) => {
      buffer.toString()
        .split(/\n/)
        .forEach((message:string)=>console.log(`[buildName:${conf.buildName}]: ${message}`));
    };

    proc.stdout.on('data', logger);
    proc.stderr.on('data', logger);
    proc.stdout.emit('data', `Starting external process:command="${this.command}" `
      + `args="${this.args ? this.args.join(' ') : ''}" options=${JSON.stringify(this.options)}`);

    if (conf.flushStream) {
      this.promises.push(new Promise((resolve, reject)=>{
        proc.on('close', (code:any)=>{
          console.log(`External process for <buildName:${conf.buildName}> finished(exit code:${code})`);
          if (code) reject(); else {resolve(); this.reload(stream, conf, mopts);}
        });
      }));
    }
    else {
      proc.on('close', (code:any)=>{
        console.log(`External process for <buildName:${conf.buildName}> finished(exit code:${code})`);
        if (code == 0) this.reload(stream, conf, mopts);
      });
    }
    return stream;
  }
}

export default GExternalBuilder;