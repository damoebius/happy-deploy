var fs = require('fs');
var Client = require('ssh2').Client;

/**
 * @class SendSSHTask
 * @param host
 * @param port
 * @param user
 * @param password
 * @param file
 * @param destination
 * @param extractDestination
 * @param sshKeyPass
 * @constructor
 */
var ExecSSHTask = function (host, port, user, password, sshKeyPass, command) {
    this.host = host;
    this.port = port;
    this.user = user;
    this.password = password;
    this.command = command;
    this.sshKeyPass = sshKeyPass;
    this.connectConfig = {
        host: this.host,
        port: this.port,
        username: this.user,
        password: this.password
    };

    if(sshKeyPass != undefined){
        this.connectConfig = {
            host: this.host,
            port: this.port,
            username: this.user,
            privateKey: require('fs').readFileSync(this.sshKeyPass)
        }
    }
};

/**
 * Process transaction
 * @method run
 * @param executeNextStep the callback
 */
ExecSSHTask.prototype.run = function(executeNextStep){
    console.log("Executing SSH command");

    var conn = new Client();
    var that = this;

    conn.on('ready', function() {
        console.log('SSH client ready');

        var command = that.command;

        console.log("Executing: " + command);

        conn.exec(command, function(err, stream) {
            if (err) {
                throw err;
            }

            stream.on('data', function(data, stderr) {
                if (stderr) {
                    console.log('STDERR: ' + data);
                    executeNextStep();
                } else {
                    console.log(''+data);
                }
            }).on('exit', function(code, signal) {
                console.log('Exited with code ' + code);
                executeNextStep();
            });
        });
    }).connect(that.connectConfig);
};

module.exports.ExecSSHTask = ExecSSHTask;