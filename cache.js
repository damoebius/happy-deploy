/**
 * Created by david on 28/09/16.
 */
var fs = require('fs');
var prompt = require('prompt-sync')();

var Cache = function (env) {
    this.env = env;
    var cache = {};
    try{
        cache = JSON.parse(fs.readFileSync(__dirname + '/.cache', 'utf8'));
    } catch(err){
        cache = {};
    }
    if(cache[env] == undefined) {
        cache[env] = {};
    }
    this.cache = cache;
    this.flush();
};

Cache.prototype.setValue = function (key,value) {
    this.cache[this.env][key]=value;
};

Cache.prototype.getValue = function (key) {
    var value = this.cache[this.env][key];
    if(value == undefined){
        console.log();
        value = prompt(key + ' est introuvable, donnez lui une valeur :');
        this.setValue(key,value);
        this.flush();

    }
    return value;

};



Cache.prototype.flush = function () {
    console.log(JSON.stringify(this.cache));
    fs.writeFileSync(__dirname + '/.cache', JSON.stringify(this.cache), 'utf8');
};


var getCache = function(env){
    return new Cache(env);
};

module.exports = {
    getCache:getCache
};