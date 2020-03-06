const gbm = require('../../lib');
const upath = require('upath');

const projectName = upath.basename(__dirname);
const prefix = projectName + ':';


// Create build definition Item #1
const buildItem1 = {
    buildName: 'task1',
    builder: (rtb) => {
        console.log(rtb.conf.buildName + ' executed - this will take 0.3 seconds to finish.');
        return gbm.utils.wait(300);
    },
    preBuild: () => {
        console.log('preBuild called. It will take 0.2 seconds.');
        return gbm.utils.wait(200);
    },
    postBuild: () => console.log('postBuild called'),
    sync: true
};

// Create build definition Item #2
const buildItem2 = {
    buildName: 'task2',
    builder: (rtb) => {
        console.log(rtb.conf.buildName + ' executed. This should have been executed after finishing task1');
    }
};

// Create build definition Item #3 which has dependency to series(task1, task2)
const series = {
    buildName: 'series',
    builder: () => {
        console.log('Task1 and Task2 were executed in series.');
    },
    dependencies: [prefix+buildItem1.buildName, prefix+buildItem2.buildName]
};

// Create build definition Item #3 which has dependency to parallel(task1, task2)
const parallel = {
    buildName: 'parallel',
    builder: () => {
        console.log('Task1 and Task2 were executed in parallel.');
    },
    dependencies: gbm.parallel(prefix+buildItem1.buildName, prefix+buildItem2.buildName)
};

module.exports = gbm.createProject({ buildItem1, buildItem2, series, parallel }, {prefix})
    .addTrigger('@build', gbm.buildNamesOf([series, parallel]));
