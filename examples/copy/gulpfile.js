// Sample

const gbm = require('../../lib');
const upath = require('upath');

// set base directory to project root
process.chdir('../../');
const basePath = upath.relative(process.cwd(), __dirname);

const copy = {
    buildName: 'copy',
    builder: {
        command: 'copy',
        target: [
            { src: [upath.join(basePath, 'path-src1/**/*.*')], dest: upath.join(basePath, 'path-dest1') },
            { src: [upath.join(basePath, 'path-src2/**/*.*')], dest: upath.join(basePath, 'path-dest2') }
        ],
        options: { verbose: true }
    },

    copy: [
        { src: [upath.join(basePath, 'path-src1/**/*.*')], dest: upath.join(basePath, 'path-dest3') },
        { src: [upath.join(basePath, 'path-src2/**/*.*')], dest: upath.join(basePath, 'path-dest4') },
    ],
    flushStream: true, // task to finish after all the files copies are finished
};

// create gbmConfig object
gbm({
    systemBuilds: {
        build: [copy],
        clean: [upath.join(basePath, 'path-dest*')],
        default: ['@clean', '@build']
    }
});
