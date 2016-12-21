var ftpClient = require('ftp-client');
var deploy = require("happy-deploy");

var SendFTPTask = function (host, port, user, password, file, destination, extractDestination) {
    this.host = host;
    this.port = port;
    this.user = user;
    this.password = password;
    this.file = file;
    this.destination = destination;
    this.extractDestination = extractDestination;
};

SendFTPTask.prototype.run = function (executeNextStep) {
    console.log('Sending package over FTP...');

    var client = new ftpClient({
        user: this.user,
        password: this.password,
        host: this.host,
        port: this.port
    });
    var that = this;

    client.connect(function () {
        console.log('Uploading...');

        client.upload(that.file, that.extractDestination, {
            overwrite: 'all',
            baseDir: process.cwd() + '/build'
        }, function (result) {
            console.log('Upload result:');
            console.log(result);

            executeNextStep();
        });
    });
};

module.exports.SendFTPTask = SendFTPTask;
