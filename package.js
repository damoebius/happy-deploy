/**
 * Created by david on 28/09/16.
 */
var fs = require('fs');
var fsx = require('fs-extra');
var targz = require('tar.gz');
var zlib = require('zlib');


/**
 * @class PackageTask
 * @param dir
 * @param file
 * @constructor
 */
var PackageTask = function (dir,file) {
    this.dir = dir;
    this.file = file;
};

/**
 * Process packaging
 * @method run
 * @param executeNextStep the callback
 */
PackageTask.prototype.run = function(executeNextStep){
    console.log("Packaging");
    targz().compress(this.dir, this.file, function(err){
        if(err) {
            console.log('Something is wrong ', err.stack);
        }
        executeNextStep();
    });

};

module.exports.PackageTask = PackageTask;