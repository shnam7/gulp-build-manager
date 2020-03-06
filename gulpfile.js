const gbm = require('./lib');
const upath = require('upath');
const fs = require('fs');

// load docs config
require('./docs/gbmconfig');

// const selector = [1] // ,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];

//--- load examples config
fs.readdirSync('./examples').forEach((name) => {
    // if (!selector.includes(parseInt(name))) return;
    const dirPath = './examples/' + name;
    if (fs.statSync(dirPath)) {
        let exConfig = upath.join(dirPath, 'gbmconfig.js');
        if (fs.existsSync(exConfig)) require('./' + exConfig);
    }
});

gbm
    .addTrigger('@build-all', /@build$/)
    .addTrigger('default', '@build-all')
    .addCleaner('@clean-all')
    .addTrigger('ex-build-all', /^\d.*@build$/)
    .addTrigger('ex-clean-all', /^\d.*@clean$/)
    .resolve();


// console.log('size=', gbm.size, ', buildNames=', gbm.buildNames);
