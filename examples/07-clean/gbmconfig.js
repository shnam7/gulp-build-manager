// Sample

const gbm = require('../../lib');
const upath = require('upath');

const projectName = upath.basename(__dirname);
const prefix = projectName + ':';

// set base directory to project root
const basePath = upath.relative(process.cwd(), __dirname);
const srcRoot = upath.join(basePath, 'assets');
const destRoot = upath.join(basePath, '_build');

class MyPlugin extends gbm.plugins.GPlugin {
    process(rtb) {
        console.log(`This is custom plugin. buildName=${rtb.conf.buildName}`)
    }
}

const copy = {
    buildName: 'copy',
    builder: 'GBuilder',
    src: [upath.join(destRoot, 'do-not-delete/sample.txt')],
    dest: destRoot
};

const build1 = {
    buildName: 'build1',
    builder: (rtb) => {
        rtb
            .chain(new MyPlugin())
            .chain((rtb) => console.log(`custom plugin#1, buildName=${rtb.conf.buildName}`))
            .chain(() => console.log('custom plugin'));
        console.log(`build1 executed: src=${rtb.conf.src}, clean=${rtb.conf.clean}`);
    },

    // add clean targets for build1
    clean: [upath.join(srcRoot, 'build1/**/*.txt')]
};

const build2 = {
    buildName: 'build2',
    builder: (rtb) => {
        console.log(`build2 executed: src=${rtb.conf.src}, clean=${rtb.conf.clean}`);
    },

    // add clean targets for build2
    clean: [
        upath.join(srcRoot, 'build2/**/dummy.txt'),

        // override systemBuilds settings and keep 'do-not-delete' directory
        "!" + destRoot,
        upath.join(destRoot, '**/*'),
        "!" + upath.join(destRoot, '{do-not-delete,do-not-delete/**/*}'),
    ]
};

const clean1 = {
    buildName: 'clean1',
    builder: rtb => rtb.clean(),
    flushStream: true, // finish clean before the build finishes (sync)
    clean: ['dir/**/files-to-delete*.*'] // set files to delete here
};

const clean2 = {
    buildName: 'clean2',
    preBuild: rtb => rtb.clean(),
    clean: ['dir/**/files-to-delete*.*'], // set files to delete here
};


module.exports = gbm.createProject({copy, build1, build2, clean1, clean2}, {prefix})
    .addTrigger('@build', /.*/)
    .addCleaner();
