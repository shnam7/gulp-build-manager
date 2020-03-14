const gbm = require('../../lib');
const upath = require('upath');

const projectName = upath.basename(__dirname);
const prefix = projectName + ':';

const cmd1 = {
    buildName: 'command1',
    builder: rtb => rtb.exec({ command: 'dir', args: ['.'] }),
    flushStream: true
}

const cmd2 = {
    buildName: 'command2',
    builder: {
        command: 'node',
        args: ['-v'],
        options: { shell: false }
    },
    flushStream: true
}

module.exports = gbm.createProject({cmd1, cmd2}, {prefix})
    .addTrigger('@build', /.*/, true);
