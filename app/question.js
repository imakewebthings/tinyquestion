var crypto = require('crypto');
var _ = require('lodash');

var questions = {};

var generateId = function() {
  try {
    var id;
    do {
      var buf = crypto.randomBytes(12);
      id = buf.toString('hex');
    } while(questions[id]);
    return id;
  }
  catch (exception) {
    console.error('Could not generate random message id');
  }
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

    var id = generateId();
    questions[id] = {
      id: id,
      text: properties.text,
      userId: properties.user.id,
      userDisplayName: properties.user.displayName,
      questionSessionId: properties.questionSessionId,
      votes: 0
    };
    callback(null, questions[id]);
  },

  read: function(id, callback) {
    if (!id) {
      return callback(new Error('Id is required'));
    }
    if (Array.isArray(id)) {
      callback(null, _.compact(id.map(function(i) {
        return questions[i];
      })));
    }
    else {
      callback(null, questions[id]);
    }
  },

  destroy: function(id, callback) {
    if (!id) {
      return callback(new Error('Id is required'));
    }
    var question = questions[id];
    if (!question) {
      return callback(new Error('Question with id ' + id + ' does not exist'));
    }

    delete questions[id];
    callback(null, question);
  },

  destroyAll: function(callback) {
    questions = {};
  },

  upvote: function(id, callback) {
    if (!id) {
      return callback(new Error('Id is required'));
    }
    if(!questions[id]) {
      return callback(new Error('Question with id' + id + ' does not exist'));
    }
    questions[id].votes++;
    callback(null, questions[id]);
  }
};
