// Sample

const gbm = require('../../lib');
const upath = require('upath');

// set base directory to project root
process.chdir('../../');
const basePath = upath.relative(process.cwd(), __dirname);

const copy1 = {
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
};

const copy2 = {
    buildName: 'copy2',
    builder: (rtb) => rtb
        .sync()
        .copy([
            { src: [upath.join(basePath, 'path-src1/**/*.*')], dest: upath.join(basePath, 'path-dest3') },
            { src: [upath.join(basePath, 'path-src2/**/*.*')], dest: upath.join(basePath, 'path-dest4') },
        ], {verbose: true})
        .wait(2000)
        .async(),
    preBuild: (rtb) => rtb
        .sync()
        .copy([
            { src: [upath.join(basePath, 'path-src1/**/*.*')], dest: upath.join(basePath, 'path-dest3-pre') },
            { src: [upath.join(basePath, 'path-src2/**/*.*')], dest: upath.join(basePath, 'path-dest4-pre') },
        ], {verbose: true})
        .wait(3000)
        .async(),

    postBuild: (rtb) => rtb
        .copy([
            { src: [upath.join(basePath, 'path-src1/**/*.*')], dest: upath.join(basePath, 'path-dest3-post') },
            { src: [upath.join(basePath, 'path-src2/**/*.*')], dest: upath.join(basePath, 'path-dest4-post') },
        ], {verbose: true}),

    // sync: true
    verbose: true
}


// create gbmConfig object
gbm({
    systemBuilds: {
        build: [copy1, copy2],
        clean: [upath.join(basePath, 'path-dest*')],
        default: ['@clean', '@build']
    }
});
