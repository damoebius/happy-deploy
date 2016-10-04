/**
 * Created by david on 29/09/16.
 */
var process = require('child_process');

var getBranchName = function(){
    var options = {
        cwd: '.',
        encoding: 'utf8'
    };
    return process.execSync('git rev-parse --abbrev-ref HEAD', options).trim();
};

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