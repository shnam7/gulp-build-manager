// Sample

const gbm = require('../../lib');
const upath = require('upath');

const projectName = upath.basename(__dirname);
const prefix = projectName + ':';
const basePath = upath.relative(process.cwd(), __dirname);
const srcRoot = upath.join(basePath, 'assets');
const destRoot = upath.join(basePath, '_build');

const copyer = {
    buildName: 'copyer',
    builder: rtb => rtb.copy([
        { src: [upath.join(destRoot, 'do-not-delete/sample.txt')], dest: destRoot }
    ]),

    // add clean targets for this BuildConf
    clean: [upath.join(destRoot, 'sample.txt')]
};

const cleaner = {
    buildName: 'cleaner',
    builder: rtb => rtb.clean({
        clean: ['dir/**/files-to-delete*.*'], // extra clean targets in addition to build config clean target
    }),

    // clean target for this build config
    clean: [
        upath.join(srcRoot, 'build2/**/dummy.txt'),
        upath.join(destRoot, '**/*'),

        // exclude from clean
        `!${upath.join(destRoot, '{do-not-delete,do-not-delete/**/*}')}`,
    ],

    flushStream: true, // finish clean before the build finishes (sync)
};

module.exports = gbm.createProject({copyer, cleaner}, {prefix})
    .addTrigger('@build', /.*/)
    .addCleaner();  // create clean task
