/**
 *  Jekyll Builder
 */
import {Options, Stream} from "../core/types";
import {GBuilder} from "../core/builder";
import {pick} from "../core/utils";

export default class GJekyllBuilder extends GBuilder {
  constructor() { super(); }

  OnBuilderModuleOptions(mopts:Options, defaultModuleOptions:Options) {
    return pick(defaultModuleOptions, 'jekyll');
  }

  // overload not to create a stream
  OnInitStream(mopts:Options, defaultModuleOptions:Options, conf:Options) { return undefined; }

  OnBuild(stream:Stream, mopts:Options, conf:Options) {
    const opts = mopts.jekyll || {};
    const jkCmd = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';
    let jkParam =[opts.subcommand || 'build'];
    if (conf.src) jkParam.push('-s ' + conf.src);
    if (conf.dest) jkParam.push('-d ' + conf.dest);
    if (opts.options) jkParam = jkParam.concat(opts.options);

    const jekyll = require('child_process').spawn(jkCmd, jkParam, {shell:true});
    const jekyllLogger = (buffer:any) => {
      buffer.toString()
        .split(/\n/)
        .forEach((message:string)=>console.log(`'Jekyll: ${message}`));
    };
    jekyll.stdout.on('data', jekyllLogger);
    jekyll.stderr.on('data', jekyllLogger);

    if (conf.flushStream) {
      this.promises.push(new Promise((resolve)=>{
        jekyll.on('close', (code:any)=>{
          console.log(`Jekyll process finished(exit code:${code})`);
          resolve();
        });
      }));
    }
    else {
      jekyll.on('close', (code:any)=>{
        console.log(`Jekyll process finished(exit code:${code})`);
        this.reload(stream, conf, mopts)
      });
    }
    return stream;
  }
}