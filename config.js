var fs = require('fs');

/**
 * return a configuration
 * @param target should reference to target.json
 */
var getConfig = function(target){
    return JSON.parse(fs.readFileSync(target, 'utf8'));
};

module.exports = {
    getConfig:getConfig
};