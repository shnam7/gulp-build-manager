const gbm = require('../../lib');
const upath = require('upath');

const basePath = upath.relative(process.cwd(), __dirname);
const projectName = upath.basename(__dirname);
const prefix = projectName + ':';

const exConfig = {
    copy1: {
        buildName: 'copy1',
        builder: {
            command: 'copy',
            target: [
                { src: [upath.join(basePath, 'path-src1/**/*.*')], dest: upath.join(basePath, 'path-dest1') },
                { src: [upath.join(basePath, 'path-src2/**/*.*')], dest: upath.join(basePath, 'path-dest2') }
            ],
            options: { verbose: true }
        },
        flushStream: true, // task to finish after all the files copies are finished
    },

    copy2: {
        buildName: 'copy2',
        builder: (rtb) => rtb
            .sync()
            .copy([
                { src: [upath.join(basePath, 'path-src1/**/*.*')], dest: upath.join(basePath, 'path-dest3') },
                { src: [upath.join(basePath, 'path-src2/**/*.*')], dest: upath.join(basePath, 'path-dest4') },
            ], {verbose: true})
            .wait(200)
            .async(),
        preBuild: (rtb) => rtb
            .sync()
            .copy([
                { src: [upath.join(basePath, 'path-src1/**/*.*')], dest: upath.join(basePath, 'path-dest3-pre') },
                { src: [upath.join(basePath, 'path-src2/**/*.*')], dest: upath.join(basePath, 'path-dest4-pre') },
            ], {verbose: true})
            .wait(300)
            .async(),

        postBuild: (rtb) => rtb
            .copy([
                { src: [upath.join(basePath, 'path-src1/**/*.*')], dest: upath.join(basePath, 'path-dest3-post') },
                { src: [upath.join(basePath, 'path-src2/**/*.*')], dest: upath.join(basePath, 'path-dest4-post') },
            ], {verbose: true}),

        // sync: true
        verbose: true
    },
}

module.exports = gbm.createProject(exConfig, {prefix})
    .addTrigger('@build', gbm.buildNamesOf(exConfig))
    .addCleaner('@clean', { clean: [upath.join(basePath, 'path-dest*')] });
