/**
 * Created by david on 28/09/16.
 */
var fs = require('fs');

var getConfig = function(target){
    return JSON.parse(fs.readFileSync( target, 'utf8'));
};

module.exports = {
    getConfig:getConfig
};