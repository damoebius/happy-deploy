var fs = require('fs');
var prompt = require('prompt-sync')();
var path = require('path');

/**
 * The Cache Manager
 * @class Cache
 * @param env The target cache
 * @constructor
 */
var Cache = function (dir, env) {
    this.env = env;
    this.cacheFile = path.normalize(dir + "/.cache");

    var cache = {};
    try{
        cache = JSON.parse(fs.readFileSync(this.cacheFile, 'utf8'));
    } catch(err){
        cache = {};
    }
    if(cache[env] == undefined) {
        cache[env] = {};
    }
    this.cache = cache;
    this.flush();
};

/**
 * Save a value to the cache
 * @method setValue
 * @param key
 * @param value
 */
Cache.prototype.setValue = function (key,value) {
    this.cache[this.env][key]=value;
};

/**
 * Return a data from the cache
 * @method getValue
 * @param key
 * @returns {string} the cached data
 */
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

/**
 * Checks if a data exists in the cache
 * @method hasValue
 * @param key
 * @returns {bool} if the data exists
 */
Cache.prototype.hasValue = function (key) {
    var value = this.cache[this.env][key];
    if (value == undefined){
        return false;
    }
    return true;
};


/**
 * Save the cache
 * @method flush
 */
Cache.prototype.flush = function () {
    console.log(JSON.stringify(this.cache));
    fs.writeFileSync(this.cacheFile, JSON.stringify(this.cache), 'utf8');
};

/**
 * Return an instance of Cache
 * @method getCache
 * @param env
 * @returns {Cache}
 */
var getCache = function(dir) {
    return function(env) {
        return new Cache(dir, env);
    };
};

module.exports = {
    getCache:getCache
};