const gbm = require('../../lib');

// set base directory to project root
process.chdir('../../');

const cmd1 = {
  buildName: 'external-command1',
  builder: new gbm.GExternalBuilder('dir', ['.']),
  flushStream: true
};

const cmd2 = {
  buildName: 'external-command2',
  builder: {
    command: 'node',
    args: ['-v'],
    options: {shell:false}
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