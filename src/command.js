'use strict';

import gulp from 'gulp';
import commander from 'commander';
import fs from 'fs';
import upath from 'upath';


function getVersion() {
  let filepath = upath.resolve(__dirname, '../package.json');
  return JSON.parse(fs.readFileSync(filepath)).version;
}

commander.usage('[command] <options ...>');
commander.option('-v, --version', 'output the version number', () => {
  let version = getVersion();
  console.log('\ngbm v' + version + '\n');
});

commander.command('init').description('create gulp-build-manager project framework').action(()=>{
  gulp.src(upath.join(__dirname, '../templates/**/{*,.*}')).pipe(gulp.dest('.'));
});

commander.parse(process.argv);