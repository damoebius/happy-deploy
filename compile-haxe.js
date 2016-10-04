/**
 * Created by david on 27/09/16.
 */
var process = require('child_process');
var fs = require('fs');
var UglifyJS = require("uglify-js");

var CompileHaxeTask = function (main, output, minify=false) {
    this.dir = '.';
    this.src = [];
    this.libs = [];
    this.output = output;
    this.main = main;
    this.minify = minify;
    this.options ='';
    this.hxml='';
};

CompileHaxeTask.prototype.run = function (executeNextStep) {
    console.log('compile haxe : ' + this.main);
    var args = ['node node_modules/haxe/bin/haxe'];
    if(this.hxml == '') {
        args.push('-main ' + this.main);
        for (var i = 0; i < this.src.length; i++) {
            args.push('-cp ' + this.src[i]);
        }
        for (var i = 0; i < this.libs.length; i++) {
            args.push('-cp node_modules/' + this.libs[i]);
        }
    } else {
        args.push(this.hxml);
    }

    if(this.options.length>0){
        args.push(this.options);
    }

    args.push('-js ' + this.output);

    var options = {
        cwd: this.dir,
        encoding: 'utf8',
        stdio: [0, 1, 2]
    };


    process.execSync(args.join(' '), options);

    if(this.minify){
        console.log('minifying...');
        var min = UglifyJS.minify(this.output);
        fs.writeFileSync(this.output, min.code);
    }
    executeNextStep();

};

module.exports.CompileHaxeTask = CompileHaxeTask;