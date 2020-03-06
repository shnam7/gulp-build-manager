const gbm = require('../../lib');
const upath = require('upath');

const projectName = upath.basename(__dirname);
const prefix = projectName + ':';

// Create build definition Item #1
const build1 = {
    buildName: 'build1',
    builder: () => {
        console.log('build1 executed - this will take 0.3 seconds to finish.');
        return gbm.utils.wait(300);
    }
};

// Create build definition Item #2
const build2 = {
    buildName: 'build2',
    builder: () => {
        console.log('build2 executed. This should have been executed after finishing build1');
    }
};

const build3 = {
    buildName: 'build3',
    builder: () => {
        console.log('build2 executed. This should have been executed before finishing build1');
    }
};


module.exports = gbm.createProject({build1, build2, build3}, {prefix})
    .addBuildItem({
        buildName: '@build',
        builder: () => { console.log('main task executed.'); },
        dependencies: [build1.buildName, build2.buildName],
        triggers: gbm.parallel(build1.buildName, build3.buildName)
    })
