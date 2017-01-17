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
var SendSSHTask = function (host, port, user, password, file, destination, extractDestination, sshKeyPass) {
    this.host = host;
    this.port = port;
    this.user = user;
    this.password = password;
    this.file = file;
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
SendSSHTask.prototype.run = function(executeNextStep){
    console.log("sending over SSH");

    var conn = new Client();
    var that = this;

    conn.on('ready', function() {
        console.log('SSH client is ready');

        conn.sftp(
            function (err, sftp) {
                if (err) {
                    console.log("Error, problem starting SFTP: %s", err);
                    process.exit(2);
                }

                console.log("SFTP started : " + that.file);

                // upload file
                var readStream = fs.createReadStream( that.file );
                var writeStream = sftp.createWriteStream( that.destination );

                // what to do when transfer finishes
                writeStream.on(
                    'close',
                    function () {
                        console.log("File transferred");
                        sftp.end();

                        var command = 'tar -zxf ' + that.destination + " -C " + that.extractDestination;
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
                                    console.log(''+data);
                                }
                            }).on('exit', function(code, signal) {
                                console.log('Exited with code ' + code);
                                executeNextStep();
                            });
                        });
                    }
                );

                // initiate transfer of file
                readStream.pipe(writeStream);
            }
        );
    }).connect(that.connectConfig);
};

module.exports.SendSSHTask = SendSSHTask;