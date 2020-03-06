// Sample

const gbm = require('../../lib');
const upath = require('upath');

const projectName = upath.basename(__dirname);
const prefix = projectName + ':';

const basePath = upath.relative(process.cwd(), __dirname);
const srcRoot = upath.join(basePath, 'assets');
const destRoot = upath.join(basePath, 'www');

// build configuration
const typeScript = {
    buildName: 'typeScript',
    builder: 'GTypeScriptBuilder',
    src: [upath.join(srcRoot, 'scripts/ts/**/!(*.d).ts')],
    dest: upath.join(destRoot, 'js'), // (file) => file.base,
    outFile: 'app.js',
    buildOptions: {
        // lint: true,
        // printConfig: true,
        sourceMap: true,
        minify: true,
        // outFileOnly: false, --> this option is not supported in TypeScriptPlugin and TypeScriptBuilder
        tsConfig: upath.join(basePath, 'tsconfig.json')
    },
    moduleOptions: {
        typescript: {
            // settings here will be merged overriding tsConfig file settings
        }
    },
    clean: [
        upath.join(destRoot, 'js'),
        upath.join(srcRoot, 'scripts/ts/**/*.{js,map,d.ts}')
    ],
};

module.exports = gbm.createProject(typeScript, { prefix })
    .addTrigger('@build', [typeScript.buildName])
    .addWatcher('@watch', {
        browserSync: {
            server: upath.resolve(destRoot),
            open: true,
            // reloadDelay:300
        },
        watch: [
            upath.join(destRoot, '**/*.html'),
        ]
    })
    .addCleaner();
