var git = require('../git');
var process = require('child_process');
var exports = module.exports = {};
const giphy = require('giphy-api-without-credentials')();
const messages = require('./messages.json');

/**
 * Gets the random message.
 *
 * @param 	{array}  The array
 * @return  {string}  The random message.
 */
var getRandomMessage = function (array) {
    return array[Math.floor(Math.random() * array.length)];
};


/**
 * Gets the success message.
 *
 * @return     {string}   The success message.
 */
exports.getSuccessMessage = function() {
    return "Everything passed! " + git.getCommiterName() + " rocks ! :thumbsup:";
};

/**
 * Gets the begin deploy message.
 *
 * @return     {string}   The begin deploy message.
 */
exports.getBeginDeployMessage = function() {
    return "#" + git.getRepoName() + " : begin deploy a commit by " + git.getCommiterName() + " on the branch " + git.getBranchName();
};

/**
 * Gets the end deploy message.
 *
 * @return     {string}   The end deploy message.
 */
exports.getEndDeployMessage = function() {
    return "#" + git.getRepoName() + " has been correctly deployed on " + git.getBranchName();
};

/**
 * Gets the deploy message.
 *
 * @return     {string}   The deploy message.
 */
exports.getDeployMessage = function() {
	var options = {
        cwd: '.',
        encoding: 'utf8'
    };
    var whoami = process.execSync('whoami', options).trim();

    return "#" + git.getRepoName() + " has been correctly deployed by  " + whoami;
};

/**
 * Gets the giphy message.
 *
 * @return {string} The deploy message.
 */
exports.getFailDeployMessage = function() {
    var message = getRandomMessage(messages.fail);
    message = message.replace('@_author_@', git.getCommiterName());

    return message;
};

/**
 * Gets the giphy message.
 *
 * @return     {string}   The deploy message.
 */
exports.getGiphyMessage = function(fn) {
	var keyword = getRandomMessage(messages.giphy);
	var url = "";

	giphy.random(keyword, function(err, res) {
 		if (err != null) {
 			url = "http://giphy.com/gifs/excited-birthday-yeah-yoJC2GnSClbPOkV0eA"; // default awesome gif
 		}  else {
 			url = res.data.url;
 		}

 		return fn(url);
	});
};
