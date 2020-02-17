// Sample

const gbm = require('../../lib');
const wait = require('../../lib/utils/utils').wait;

// set base directory to project root
process.chdir('../../');

// Create build definition Item #1
const buildItem1 = {
    buildName: 'task1',
    builder: (rtb) => {
        console.log(rtb.conf.buildName + ' executed - this will take 0.3 seconds to finish.');
        return new Promise(resolve => setTimeout(() => resolve(), 300));
    },
    preBuild: () => { console.log('preBuild called. It will take 0.2 seconds.'); return wait(200) },
    postBuild: () => console.log('postBuild called')
};

// Create build definition Item #2
const buildItem2 = {
    buildName: 'task2',
    builder: (rtb) => {
        console.log(rtb.conf.buildName + ' executed. This should have been executed after finishing task1');
    }
};

// Create build definition Item #3 which has dependency to series(task1, task2)
const buildItem3 = {
    buildName: 'series',
    builder: () => {
        console.log('Task1 and Task2 were executed in series.');
    },
    dependencies: ['task1', 'task2']
};

// Create build definition Item #3 which has dependency to parallel(task1, task2)
const buildItem4 = {
    buildName: 'parallel',
    builder: () => {
        console.log('Task1 and Task2 were executed in parallel.');
    },
    dependencies: gbm.parallel('task1', 'task2')
};


// create gbmConfig object
gbm({
    systemBuilds: {
        build: [buildItem1, buildItem2, buildItem3, buildItem4],
        clean: ["__dummy"], // dummy to create '@close' task to make main gulpfile not to fail with error
        default: ['series', 'parallel']
    }
});
