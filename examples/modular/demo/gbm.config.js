// Demo

const gbm = require('../../../lib');
const upath = require('upath');

// set base directory to project root
const basePath = upath.relative(process.cwd(), __dirname);
const srcRoot = upath.join(basePath, 'assets');
const destRoot = upath.join(basePath, '_build');

const demo = {
    scss: {
        buildName: 'demo:scss',
        builder: 'GCSSBuilder',
        src: [upath.join(srcRoot, 'scss/**/*.scss')],
        dest: upath.join(destRoot, 'css'),
        buildOptions: {
            postcss: true
        },
        clean: [upath.join(destRoot, 'css'),] // sample to show adding clean items
    },

    scripts: {
        buildName: 'demo:scripts',
        builder: 'GTypeScriptBuilder',
        src: [upath.join(srcRoot, 'scripts/ts/**/*.ts')],
        dest: upath.join(destRoot, 'js')
    },

    // uset get function here to have access to this mylib object
    get main() {
        return {
            buildName: 'demo',
            dependencies: gbm.parallel(this.scss, this.scripts)
        }
    }
};

module.exports = demo;
