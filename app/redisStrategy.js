var _ = require('lodash');
var redis;

var composeKey = function(collection, id) {
  return _.compact([collection, id]).join(':');
};

module.exports = {
  setClient: function(client) {
    redis = client;
  },

  putHash: function(collection, id, hash, callback) {
    redis.hmset(composeKey(collection, id), hash, function(err, result) {
      if (err) {
        throw err;
      }
      callback(null, hash);
    });
  },

  readHash: function(collection, id, callback) {
    redis.hgetall(composeKey(collection, id), callback);
  },

  readMultipleHashes: function(collection, ids, callback) {
    var multi = redis.multi();
    ids.forEach(function(id) {
      multi.hgetall(composeKey(collection, id));
    });
    multi.exec(callback);
  },

  destroy: function(collection, id, callback) {
    redis.del(composeKey(collection, id), callback);
  },

  destroyMultiples: function(collection, ids, callback) {
    var args = ids.map(function(id) {
      return composeKey(collection, id);
    }).push(callback);
    redis.del.apply(redis, args);
  },

  destroyAll: function(collection, callback) {
    redis.keys(composeKey(collection, '*'), function(err, keys) {
      keys.push(callback);
      redis.del.apply(redis, keys);
    });
  },

  createEmptyList: function(collection, id, callback) {
    callback();
  },

  listAppend: function(collection, id, item, callback) {
    redis.rpush(composeKey(collection, id), item, callback);
  },

  readList: function(collection, id, callback) {
    redis.lrange(composeKey(collection, id), 0, -1, function(err, list) {
      callback(err, list ? list : []);
    });
  }
};
