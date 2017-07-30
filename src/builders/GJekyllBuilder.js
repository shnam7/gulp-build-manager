/**
 *  Jekyll Builder
 */

'use strict';
import gbm from '../';

export default class GJekyllBuilder extends gbm.GBuilder {
  constructor() { super(); }

  OnBuilderModuleOptions(mopts, defaultModuleOptions) {
    return this.pick(defaultModuleOptions, ['jekyll']);
  }

  // overload not to create a stream
  OnInitStream(mopts, defaultModuleOptions, conf) {}

  OnBuild(stream, mopts, conf) {
    const opts = mopts.jekyll || {};
    const jkCmd = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';
    let jkParam =[opts.subcommand || 'build'];
    if (conf.src) jkParam.push('-s ' + conf.src);
    if (conf.dest) jkParam.push('-d ' + conf.dest);
    if (opts.options) jkParam = jkParam.concat(opts.options);

    const jekyll = require('child_process').spawn(jkCmd, jkParam, {shell:true});
    const jekyllLogger = (buffer) => {
      buffer.toString().split(/\n/).forEach(message=>console.log(`'Jekyll: ${message}`));
    };
    jekyll.stdout.on('data', jekyllLogger);
    jekyll.stderr.on('data', jekyllLogger);
    const done = this.done;
    this.done = undefined;  // delay done until jekyll task is finished
    jekyll.on('close', (code)=>{
      if (conf.watch && conf.watch.livereload) require('gulp-livereload').changed(conf.src || '.');
      console.log(`Jekyll process finished(exit code:${code})`);
      done();
    });
    return stream;
  }
}
module.exports = GJekyllBuilder;
