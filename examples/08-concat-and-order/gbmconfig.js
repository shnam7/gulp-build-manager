// Sample

const gbm = require('../../lib');
const upath = require('upath');

const projectName = upath.basename(__dirname);
const prefix = projectName + ':';

const basePath = upath.relative(process.cwd(), __dirname);
const srcRoot = upath.join(basePath, 'assets');
const destRoot = upath.join(basePath, '_build');

const concat = {
    buildName: 'concat',
    builder: 'GConcatBuilder',
    src: [upath.join(srcRoot, '*.js')],
    order: ['file2.js', '*.js'],
    dest: destRoot,
    outFile: 'concated.js',
    clean: [destRoot]
};

module.exports = gbm.createProject(concat, {prefix})
    .addTrigger('@build', [concat.buildName])
    .addCleaner()
