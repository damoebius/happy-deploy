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

/**
 * Gets the commiter name.
 * @method getCommiterName
 * @return {string} The commiter name.
 */
var getCommiterName = function(){
    var options = {
        cwd: '.',
        encoding: 'utf8'
    };

    return process.execSync('git --no-pager show -s --format="%an"', options).trim();
};

/**
 * Gets the commit hash and message.
 * like that :
 * "50fe854 My awesome feature"
 * @method getCommitHashMessage
 * @return {string} The commit hash + message
 */
var getCommitHashMessage = function(){
    var options = {
        cwd: '.',
        encoding: 'utf8'
    };

    return process.execSync('git log -1 --abbrev-commit --pretty=oneline', options).trim();
};

/**
 * Gets the commit hash full
 * like that :
 * "50fe854cfc024f63349bb8ffe9886798b89bafd0"
 * @method getCommitHash
 * @return {string} The commit hash
 */
var getCommitHash = function(){
    var options = {
        cwd: '.',
        encoding: 'utf8'
    };

    return process.execSync('git --no-pager show -s --format="%H"', options).trim();
};

/**
 * Gets the repo url.
 * @method getRepoUrl
 *
 * @return {string} The repo url.
 */
var getRepoUrl = function() {
    var options = {
        cwd: '.',
        encoding: 'utf8'
    };

    return process.execSync('git config --get remote.origin.url', options).trim();
};

/**
 * Gets the repo name.
 * @method getRepoName
 * @return {string}  The repo name.
 */
var getRepoName = function() {
    var repoUrl = getRepoUrl();
    return repoUrl.substring(repoUrl.lastIndexOf('/') + 1, repoUrl.length - 4).trim();
};

module.exports = {
    getBranchName:getBranchName,
    getCurrentTag:getCurrentTag,
    getCommiterName:getCommiterName,
    getRepoName:getRepoName,
    getCommitHashMessage:getCommitHashMessage,
    getRepoUrl:getRepoUrl,
    getCommitHash:getCommitHash
};