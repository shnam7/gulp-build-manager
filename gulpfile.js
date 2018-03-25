const gbm = require('./lib');
const fs = require('fs');

function createConfig(buildName, dirPath, taskName='') {
  return {
    buildName: buildName,
    builder: { command:'npm', args:['run', 'gulp', '--', '--cwd', dirPath, taskName], options:{shell:true}},
    flushStream: true
  }
}

const docs = createConfig('docs', 'docs');
const docsClean = createConfig('docs-clean', 'docs', '@clean');
const exAll = [];
let exBuildNames = [];
let exCleanNames = [];

fs.readdirSync('./examples').forEach((name)=>{
  const buildName = 'ex-' + name;
  const cleanName = buildName + '-clean';
  const dirPath = './examples/' + name;
  if (fs.statSync(dirPath).isDirectory()) {
    exAll.push(createConfig(buildName, dirPath, '@build'));
    exAll.push(createConfig(cleanName, dirPath, '@clean'));
    exBuildNames.push(buildName);
    exCleanNames.push(cleanName);
  }
});

const exBuild = {buildName: '@ex-build-all', dependencies: exBuildNames};
const exClean = {buildName: '@ex-clean-all', dependencies: exCleanNames};
const cleanAll = {buildName: '@clean', dependencies: ['docs-clean'].concat(exCleanNames)};

gbm({
  builds: [docs, docsClean, exAll, exBuild, exClean, cleanAll],
  systemBuilds: {
    build: ['docs'].concat(exBuildNames),
    default: ['@build']
  }
});
