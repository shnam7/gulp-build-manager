// Sample

const gbm = require('../../lib');
const upath = require('upath');

const projectName = upath.basename(__dirname);
const prefix = projectName + ':';

// set base directory to project root
const basePath = upath.relative(process.cwd(), __dirname);
const srcRoot = upath.join(basePath, 'assets');
const destRoot = upath.join(basePath, '_build');
const destZip = upath.join(basePath, '_dist');

const copy = {
    buildName: 'copy',
    builder: 'GBuilder',
    src: upath.join(srcRoot, 'copy-me/**/*.txt'),
    dest: destRoot,
}

const images = {
    buildName: 'images',
    builder: 'GImagesBuilder',
    src: upath.join(srcRoot, 'images/**/*'),
    dest: destRoot,
}

const zip = {
    buildName: 'zip',
    builder: 'GZipBuilder',
    src: [
        upath.join(destRoot, '**/*'),
        upath.join(srcRoot, 'zip-me-too/**/*')
    ],
    dest: destZip,
    outFile: 'primitives.zip',
    watch: []   // disable watch by setting 'watch' to empty array
}


module.exports = gbm.createProject({copy, images, zip}, {prefix})
    .addBuildItem({
        buildName: '@build',
        dependencies: [gbm.parallel(copy.buildName, images.buildName), zip.buildName],
        clean: [destRoot, destZip]
    })
    .addWatcher()
    .addCleaner()
