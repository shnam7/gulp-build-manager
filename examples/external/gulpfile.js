const gbm = require('../../lib');
const gulp = require('gulp');

process.chdir(__dirname);

const cmd1 = {
  buildName: 'external-command1',
  builder: new gbm.GExternalBuilder('dir', ['.'], {shell:true}),
  flushStream: true
};

const cmd2 = {
  buildName: 'external-command2',
  builder: {
    command: 'node',
    args: ['-v'],
    options: {shell:true}
  },
  flushStream: true
};

gbm({
  systemBuilds: {
    build: [cmd1, cmd2],
    clean: [""],  // dummy to create '@close' task to make main gulpfile not to fail with error
    default: ['@build']
  }
});