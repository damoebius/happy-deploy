var process = require('child_process');
var fs = require('fs');
var UglifyJS = require("uglify-js");

/**
 * Compile Haxe Task
 * @class CompileHaxeTask
 * @param main The main class to compile
 * @param output The output file
 * @param minify minify or not
 * @constructor
 */
var CompileHaxeTask = function (main, output, minify=false) {
    /**
     * @property dir the home directory
     * @type {string}
     */
    this.dir = '.';
    /**
     * @property src src folder list
     * @type {Array}
     */
    this.src = [];
    /**
     * @property libs list of haxe libs
     * @type {Array}
     */
    this.libs = [];
    this.output = output;
    this.main = main;
    this.minify = minify;
    /**
     * @property options optionnals arguments
     * @type {string}
     */
    this.options ='';
    /**
     * @property hxml
     * @type {string}
     */
    this.hxml='';
};

/**
 * Process compilation
 * @method run
 * @param executeNextStep the callback
 */
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