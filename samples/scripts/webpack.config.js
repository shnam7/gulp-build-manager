import upath from 'upath';

let srcRoot = 'assets';
let destRoot = '_build';

module.exports = {
  entry: upath.resolve(srcRoot, 'ts/sample-ts.js'),
  output: {
    filename: 'bundle.js',
    path: upath.resolve(destRoot, '')
  },
};