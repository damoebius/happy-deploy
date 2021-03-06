var Slack = require('slack-node');
var git = require('../git');
var messages = require('./messages');
var commandLineArgs = require('command-line-args');

/**
 * Writes to slack.
 *
 * @param {string}  messageType  The message type
 */
module.exports.writeToSlack = function(messageType) {
    // Set options definitions
    const optionDefinitions = [
        { name: 'url', type: String },
        { name: 'channel', alias: 'c',  type: String },
        { name: 'env', alias: 'e',  type: String }
    ];

    const username =  "NPM bot";
    var emoji =  ":happytech:";
    const colourHappy = "#19a175";
    const options = commandLineArgs(optionDefinitions);

    if (!options.url) {
        console.warn("No slack URL set. Please set this with the --url option");
        process.exit(9);
    }

    if(!options.channel) {
        console.warn("No slack channel set. Send to #general, or please set this with the --channel option");
        options.channel = "#general"
    }

    var slack = new Slack();
    slack.setWebhook(options.url);

    var colour = colourHappy;
    let slackMessage = '';
    var isDeployChannel = false;
    let attachments = [];

     switch (messageType) {
        case "beginDeploy":
            slackMessage = messages.getBeginDeployMessage();
            colour = "warning";
            send(slackMessage);
            break;

        case "endDeploy":
            slackMessage = messages.getEndDeployMessage();
            send(slackMessage);
            break;

        case "deployfail":
            slackMessage = messages.getFailDeployMessage();
            colour = "danger";
            emoji = ":warning:";
            attachments = [{
                "color": colour,
                "fields": [
                    {
                        "title":"Environnement",
                        "value": options.env
                    }, {
                        "title" : "Branch",
                        "value": git.getBranchName()
                    },{
                        "title": "Last commit",
                        "value": git.getCommitHashMessage()
                    }]
            }];
            send(slackMessage);
            break;

        case "deploy":
            slackMessage = messages.getDeployMessage();
            isDeployChannel = true;
            attachments = [{
                "color": colour,
                "fields": [
                    {
                        "title":"Environnement",
                        "value": options.env
                    }, {
                        "title" : "Branch",
                        "value": git.getBranchName()
                    },{
                        "title": "Last commit",
                        "value": git.getCommitHashMessage()
                    }]
            }];
            send(slackMessage);
            break;

        case "success":
            slackMessage = messages.getSuccessMessage();
            break;

        case "giphy":
            slackMessage = messages.getGiphyMessage(function(data){
                slackMessage = data;
                send(slackMessage);
            });
            break;

        default:
            colour = colourHappy;
            send(slackMessage);
            break;
    }

    /**
     * send message
     *
     * @param {string}  message  The message
     */
    function send(message) {
        // In a function for wait external calls.
        slack.webhook({
            channel: options.channel,
            username: username,
            icon_emoji: emoji,
            text: message,
            attachments: attachments
        }, function(err, response) {
            console.warn(response);
        });
    }
};

