// Sample

const gbm = require('../../lib');
const upath = require('upath');

// set base directory to project root
process.chdir('../../');
const basePath = upath.relative(process.cwd(), __dirname);
const srcRoot = upath.join(basePath, 'assets');
const destRoot = upath.join(basePath, '_build');

// build configuration
const typeScript = {
    buildName: 'typeScript',
    builder: 'GTypeScriptBuilder',
    src: [upath.join(srcRoot, 'scripts/ts/**/!(*.d).ts')],
    dest: upath.join(destRoot, 'js'), // (file) => file.base,
    outFile: 'app.js',
    postBuild: rtb => rtb.copy([{
        src: upath.join(basePath, 'pages/**/*.html'), dest: upath.join(destRoot, '')
    }]),

    flushStream: true,
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
    watch: {
        watchedPlus: [upath.join(basePath, 'pages/**/*.html')]
    }
};


// build manager
gbm({
    systemBuilds: {
        build: typeScript,
        clean: [
            destRoot,
            upath.join(srcRoot, 'scripts/ts/**/*.{js,map,d.ts}')
        ],
        default: ['@clean', '@build'],
        watch: {
            browserSync: {
                server: upath.resolve(destRoot),
                open: true,
                // reloadDelay:300
            }
        }
    }
});
