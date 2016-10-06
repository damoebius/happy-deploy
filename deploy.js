/**
 * Created by david on 27/09/16.
 */
console.log('Happy Deploy System');
var exitTask = {
    run: function () {
        console.log("END");
        process.exit(0);
    }
}

var currentTaskIndex = 0;
var taskList = [];

var executeNextStep = function () {
    currentTaskIndex++;
    taskList[currentTaskIndex].run(executeNextStep);
};

var run = function () {
    addTask(exitTask);
    taskList[0].run(executeNextStep);
}

var addTask = function (task) {
    taskList.push(task);
}


module.exports = {
    run: run,
    git:require('./git'),
    getCache: require('./cache').getCache,
    getConfig: require('./config').getConfig,
    CompileHaxeTask: require('./compile-haxe').CompileHaxeTask,
    CompassTask: require('./compass').CompassTask,
    addTask: addTask
}
