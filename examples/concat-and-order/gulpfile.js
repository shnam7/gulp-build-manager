// Sample

const gbm = require('../../lib');
const upath = require('upath');

// set base directory to project root
process.chdir('../../');
const basePath = upath.relative(process.cwd(), __dirname);
const srcRoot = upath.join(basePath, 'assets');
const destRoot = upath.join(basePath, '_build');

const concat = {
    buildName: 'concat',
    builder: 'GConcatBuilder',
    src: [upath.join(srcRoot, '*.js')],
    order: ['file2.js', '*.js'],
    dest: destRoot,
    outFile: 'concated.js'
};

// create gbmConfig object
gbm({
    systemBuilds: {
        build: [concat],
        clean: [destRoot],
        default: 'concat',
    }
});
