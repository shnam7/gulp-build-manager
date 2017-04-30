'use strict';

import gulp from 'gulp';
import commander from 'commander';
import fs from 'fs';
import upath from 'upath';
import is from './utils/is';


function getVersion() {
  let filepath = upath.resolve(__dirname, '../package.json');
  return JSON.parse(fs.readFileSync(filepath)).version;
}

commander.usage('[command] <options ...>');
commander.option('-v, --version', 'output the version number', () => {
  let version = getVersion();
  console.log('\ngbm v' + version + '\n');
});

commander.command('init').description('create project framework').action((dir)=>{
  if (!is.String(dir)) dir = '.';
  gulp.src(upath.join(__dirname, '../templates/**/{*,.*}')).pipe(gulp.dest('.'));
});

commander.parse(process.argv);

// display help when invoked with no argument
if (!process.argv.slice(2).length) {
  commander.outputHelp();
}