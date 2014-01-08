var crypto = require('crypto');
var _ = require('lodash');
var persistence = require('./persistence')();

var generateId = function(callback) {
  crypto.randomBytes(12, function(err, buffer) {
    if (err) {
      throw err;
    }
    var id = buffer.toString('hex');
    persistence.readHash('question', id, function(err, question) {
      if (question) {
        return generateId(callback);
      }
      callback(null, id);
    });
  });
};

module.exports = {
  create: function(properties, callback) {
    if (!properties) {
      return callback(new Error('Question requires properties object'));
    }
    if (!properties.questionSessionId) {
      return callback(new Error('Question requires a question session id'));
    }
    if (!properties.user) {
      return callback(new Error('Question requires a user'));
    }
    if (!properties.text) {
      return callback(new Error('Question requires text'));
    }

    generateId(function(err, id) {
      persistence.putHash('question', id, {
        id: id,
        text: properties.text,
        userId: properties.user.id,
        userDisplayName: properties.user.displayName,
        userUsername: properties.user.username,
        userPhoto: properties.user.photo,
        questionSessionId: properties.questionSessionId,
        votes: 0
      }, callback);
    });
  },

  read: function(id, callback) {
    if (!id) {
      return callback(new Error('Id is required'));
    }
    if (Array.isArray(id)) {
      return persistence.readMultipleHashes('question', id, callback);
    }
    persistence.readHash('question', id, callback);
  },

  destroy: function(id, callback) {
    if (!id) {
      return callback(new Error('Id is required'));
    }
    if (Array.isArray(id)) {
      return persistence.destroyMultiples('question', id, callback);
    }
    persistence.destroy('question', id, callback);
  },

  destroyAll: function(callback) {
    persistence.destroyAll('question', callback);
  },

  upvote: function(id, callback) {
    if (!id) {
      return callback(new Error('Id is required'));
    }
    persistence.readHash('question', id, function(err, question) {
      if(!question) {
        return callback(new Error('Question with id' + id + ' does not exist'));
      }
      question.votes++;
      persistence.putHash('question', id, question, callback);
    });
  }
};
