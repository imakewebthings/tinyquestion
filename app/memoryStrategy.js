var _ = require('lodash');

var store = {};

module.exports = {
  setClient: function(client) {},

  putHash: function(collection, id, hash, callback) {
    if (!store[collection]) {
      store[collection] = {};
    }
    store[collection][id] = hash;
    callback(null, hash);
  },

  readHash: function(collection, id, callback) {
    var hash = store[collection] ? store[collection][id] : undefined;
    callback(null, hash);
  },

  readMultipleHashes: function(collection, ids, callback) {
    callback(null, _.compact(ids.map(function(id) {
      return store[collection][id];
    })));
  },

  destroy: function(collection, id, callback) {
    var obj = store[collection][id];
    delete store[collection][id];
    callback(null, obj);
  },

  destroyMultiples: function(collection, ids, callback) {
    var destroyed = [];
    ids.forEach(function(id) {
      destroyed.push(store[collection][id]);
      delete store[collection][id];
    });
    callback(null, destroyed);
  },

  destroyAll: function(collection, callback) {
    store[collection] = {};
    callback();
  },

  createEmptyList: function(collection, id, callback) {
    store[collection] = store[collection] || {};
    store[collection][id] = [];
    callback(null, store[collection][id]);
  },

  listAppend: function(collection, id, item, callback) {
    store[collection][id].push(item);
    callback(null, store[collection][id]);
  },

  readList: function(collection, id, callback) {
    var list = store[collection] ? store[collection][id] : undefined;
    callback(null, list);
  }
};
