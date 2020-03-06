const gbm = require('../../lib');
const upath = require('upath');

const projectName = upath.basename(__dirname);
const prefix = projectName + ':';

const exConfig = {
    cmd1: {
        buildName: 'command1',
        builder: rtb => rtb.exec({ command: 'dir', args: ['.'] }),
        flushStream: true
    },

    cmd2: {
        buildName: 'command2',
        builder: {
            command: 'node',
            args: ['-v'],
            options: { shell: false }
        },
        flushStream: true
    },
};

module.exports = gbm.createProject(exConfig, {prefix})
    .addTrigger('@build', gbm.buildNamesOf(exConfig), {
        sync: true
    });
