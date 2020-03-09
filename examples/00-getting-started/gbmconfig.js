const gbm = require('../../lib');
const upath = require('upath');

const basePath = upath.relative(process.cwd(), __dirname);
const projectName = upath.basename(__dirname);
const prefix = projectName + ':';

module.exports = gbm.createProject()
    .addWatcher(prefix + '@watch', {
        watch: [upath.join(basePath, 'www/**/*.html')],
        browserSync: { server: upath.join(basePath, 'www') }
    });
