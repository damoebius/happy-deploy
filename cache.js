var fs = require('fs');
var prompt = require('prompt-sync')();

/**
 * The Cache Manager
 * @class Cache
 * @param env The target cache
 * @constructor
 */
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
    fs.writeFileSync(__dirname + '/.cache', JSON.stringify(this.cache), 'utf8');
};

/**
 * Return an instance of Cache
 * @method getCache
 * @param env
 * @returns {Cache}
 */
var getCache = function(env){
    return new Cache(env);
};

module.exports = {
    getCache:getCache
};