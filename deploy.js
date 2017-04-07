var path = require('path');

/**
 * The main Deploy Module
 */
console.log('Happy Deploy System');

var exitTask = {
    run: function () {
        console.log("END");
        process.exit(0);
    }
};

var currentTaskIndex = 0;
var taskList = [];

var executeNextStep = function () {
    currentTaskIndex++;
    taskList[currentTaskIndex].run(executeNextStep);
};

/**
 * Run the task queue
 * @method run
 */
var run = function () {
    addTask(exitTask);
    taskList[0].run(executeNextStep);
};

/**
 * Add a task to the queue
 * @method addTask
 * @param task
 */
var addTask = function (task) {
    taskList.push(task);
};


module.exports = {
    run: run,

    /**
     * The git module
     * @property git
     */
    git:require('./git'),

    /**
     * Get cached data
     * @method getCache
     */
    getCache: require('./cache').getCache(path.resolve('.')),

    /**
     * Get configured data
     * @method getConfig
     */
    getConfig: require('./config').getConfig,

    /**
     * The compile Haxe task class
     * @class CompileHaxeTask
     */
    CompileHaxeTask: require('./compile-haxe').CompileHaxeTask,

    /**
     * The compile compass task class
     * @class CompassTask
     */
    CompassTask: require('./compass').CompassTask,

    /**
     * The package task class
     * @class PackageTask
     */
    PackageTask: require('./package').PackageTask,

    /**
     * The send over SSH task class
     * @class SendSSHTask
     */
    SendSSHTask: require('./send-ssh').SendSSHTask,

    /**
     * The send over FTP task class
     * @class SendFTPTask
     */
    SendFTPTask: require('./send-ftp').SendFTPTask,

    /**
     * The exec SSH task class
     * @class ExecSSHTask
     */
    ExecSSHTask: require('./exec-ssh').ExecSSHTask,

    /**
     * The extract over SSH and extract task class
     * @class ExtractSSHTask
     */
    ExtractSSHTask: require('./extract-ssh').ExtractSSHTask,

    addTask: addTask
};
