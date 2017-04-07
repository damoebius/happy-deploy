var fs = require('fs');
var Client = require('ssh2').Client;

/**
 * @class ExtractSSHTask
 * @param host
 * @param port
 * @param user
 * @param password
 * @param destination
 * @param extractDestination
 * @param sshKeyPass
 * @constructor
 */
var ExtractSSHTask = function (host, port, user, password, destination, extractDestination, sshKeyPass) {
    this.host = host;
    this.port = port;
    this.user = user;
    this.password = password;
    this.destination = destination;
    this.extractDestination = extractDestination;
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
ExtractSSHTask.prototype.run = function(executeNextStep){
    console.log("Extracting over SSH");

    var conn = new Client();
    var that = this;

    conn.on('ready', function() {
        var command = 'tar -zxf ' + that.destination + " -C " + that.extractDestination;

        console.log('SSH client is ready');
        console.log("Extracting: " + command);

        conn.exec(command, function(err, stream) {
            if (err) {
                throw err;
            }

            stream.on('data', function(data, stderr) {
                if (stderr) {
                    console.log('STDERR: ' + data);
                    executeNextStep();
                } else {
                    console.log('' + data);
                }
            }).on('exit', function(code, signal) {
                console.log('Exited with code ' + code);
                executeNextStep();
            });
        });
    }).connect(that.connectConfig);
};

module.exports.ExtractSSHTask = ExtractSSHTask;