var compass = require('compass');

/**
 * Compile Compass
 * @class CompassTask
 * @param dir the target directory to compile
 * @constructor
 */
var CompassTask = function (dir) {
    this.dir = dir;
};

/**
 * Process compilation
 * @method run
 * @param executeNextStep the callback
 */
CompassTask.prototype.run = function(executeNextStep){
    console.log("compile compass");
    compass.compile({ cwd: this.dir }, function(err, stdout, stderr) {
        if(err == null) {
            console.log(stdout);
            executeNextStep();
        } else {
            console.warn(err)
        }
    });
};

module.exports.CompassTask = CompassTask;