/**
 * Utility - is
 */

'use strict';

const is = {
  Array: function(a) { return Array.isArray(a); },
  Object: function (a) { return a === Object(a); },
};

// this code referenced underscore: https://github.com/jashkenas/underscore
for (const name of ['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error', 'Symbol', 'Map', 'WeakMap', 'Set', 'WeakSet']) {
  is[name] = function(a) {
    return toString.call(a) === '[object ' + name + ']';
  };
}

module.exports = is;
export default is;
