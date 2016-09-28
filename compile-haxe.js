/**
 * Created by david on 27/09/16.
 */
var process = require('child_process');

var CompileHaxeTask = function (main, output) {
    this.dir = '.';
    this.src = [];
    this.libs = [];
    this.output = output;
    this.main = main;
};

CompileHaxeTask.prototype.run = function (executeNextStep) {
    console.log('compile haxe to ' + this.dir);
    var args = ['node node_modules/haxe/bin/haxe'];
    args.push('-main ' + this.main + ' -js ' + this.output);
    for (var i = 0; i < this.src.length; i++) {
        args.push('-cp ' + this.src[i]);
    }
    for (var i = 0; i < this.libs.length; i++) {
        args.push('-cp node_modules/' + this.libs[i]);
    }

    var options = {
        cwd: this.dir,
        encoding: 'utf8',
        stdio: [0, 1, 2]
    };

    process.execSync(args.join(' '), options);
    executeNextStep();

};

module.exports.CompileHaxeTask = CompileHaxeTask;