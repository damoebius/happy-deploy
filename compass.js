/**
 * Created by david on 28/09/16.
 */
var compass = require('compass');

var CompassTask = function (dir) {
    this.dir = dir;
};

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