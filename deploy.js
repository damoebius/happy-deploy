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
     * The git Module
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
     * The Compile Haxe Task Class
     * @class CompileHaxeTask
     */
    CompileHaxeTask: require('./compile-haxe').CompileHaxeTask,

    /**
     * The Compile Compass Task Class
     * @class CompassTask
     */
    CompassTask: require('./compass').CompassTask,

    /**
     * The Package Task Class
     * @class PackageTask
     */
    PackageTask: require('./package').PackageTask,

    /**
     * The Send over SSH and Extract Task Class
     * @class SendSSHTask
     */
    SendSSHTask: require('./send-ssh').SendSSHTask,

    SendFTPTask: require('./send-ftp').SendFTPTask,

    ExecSSHTask: require('./exec-ssh').ExecSSHTask,

    addTask: addTask
};
