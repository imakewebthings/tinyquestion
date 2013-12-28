var crypto = require('crypto');

var questionSessions = {};

var generateId = function() {
  var id;
  try {
    do {
      var buffer = crypto.randomBytes(2);
      id = buffer.toString('hex');
    } while (questionSessions[id])
    return id;
  }
  catch (exception) {
    console.error('Crypto could not generate random bytes');
  }
};

module.exports = {
  create: function(callback) {
    var id = generateId();
    questionSessions[id] = [];
    callback(null, questionSessions[id]);
  },

  read: function(id, callback) {
    if (!id) {
      return callback(new Error('Question session id required'));
    }
    callback(null, questionSessions[id]);
  }
};
