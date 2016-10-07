
var process = require('child_process');

/**
 * @method getBranchName
 * @returns {string}
 */
var getBranchName = function(){
    var options = {
        cwd: '.',
        encoding: 'utf8'
    };
    return process.execSync('git rev-parse --abbrev-ref HEAD', options).trim();
};

/**
 * @method getCurrentTag
 * @returns {string}
 */
var getCurrentTag = function(){
    var options = {
        cwd: '.',
        encoding: 'utf8'
    };
    return process.execSync('git tag -l --contains HEAD', options).trim();
};

module.exports = {
    getBranchName:getBranchName,
    getCurrentTag:getCurrentTag
};