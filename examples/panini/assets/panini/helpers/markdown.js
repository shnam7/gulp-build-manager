module.exports = function (options) {
    return require('marked')(options.fn(this));
};
