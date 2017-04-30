'use strict';

import gulp from 'gulp';
import fs from 'fs';
import commander from 'commander';
import upath from 'upath';

commander
  .version('1.2.12')
  .usage('[command] <options ...>');

commander
  .command('init [dir]')
  .description('create project framework')
  .option('-f, --force', 'force overwriting existing files')
  .action((dir, cmd) => {
    if (!dir) dir = '.';

    if (!cmd.force) {
      if (fs.existsSync(upath.resolve(dir, 'gulpfile.babel.js'))) {
        console.log('Warning:File already exists:gulpfile.babel.js. Process stopped.');
        process.exit(0);
      }
      if (fs.existsSync(upath.resolve(dir, '.babelrc'))) {
        console.log('Warning:File already exists:.babelrc. Process stopped.');
        process.exit(0);
      }
      if (fs.existsSync(upath.resolve(dir, 'gulp'))) {
        console.log('Warning:Directory already exists:gulp. Process stopped.');
        process.exit(0);
      }
    }

    console.log(`Creating gulp-build-manager project in '${dir}' ...`);
    gulp.src(upath.join(__dirname, '../templates/**/{*,.*}')).pipe(gulp.dest(dir));
    console.log('--> Done.\n');
  });

commander.parse(process.argv);

// display help when invoked with no argument
if (!process.argv.slice(2).length) {
  commander.outputHelp();
}
