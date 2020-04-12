const gbm = require('../../lib');
const upath = require('upath');

const projectName = upath.basename(__dirname);
const prefix = projectName + ':';


// Create BuildConf Item #1
const build1 = {
    buildName: 'build1',
    builder: (rtb) => console.log(rtb.buildName + ' executed.'),
    preBuild: (rtb) => console.log(rtb.buildName + ' preBuild called.'),
    postBuild: (rtb) => console.log(rtb.buildName + ' postBuild called.'),
};

// Create BuildConf Item #2
const build2 = {
    buildName: 'build2',
    builder: (rtb) => console.log(rtb.buildName + ' executed.'),
    preBuild: (rtb) => console.log(rtb.buildName + ' preBuild called.'),
    postBuild: (rtb) => console.log(rtb.buildName + ' postBuild called.'),
};

// Create BuildConf for main
const main = {
    buildName: '@build',
    builder: (rtb) => console.log(rtb.buildName + ' executed.'),
    preBuild: (rtb) => console.log(rtb.buildName + ' preBuild called.'),
    postBuild: (rtb) => console.log(rtb.buildName + ' postBuild called.'),

    dependencies: gbm.parallel(build1, build2),
    triggers: gbm.series(build1, build2)
};

module.exports = gbm.createProject({ build1, build2, main }, {prefix});
