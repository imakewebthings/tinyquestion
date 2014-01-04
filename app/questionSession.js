var crypto = require('crypto');
var Question = require('./question');

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
    questionSessions[id] = {
      id: id,
      questionIds: []
    };
    callback(null, questionSessions[id]);
  },

  read: function(id, callback) {
    if (!id) {
      return callback(new Error('Question session id required'));
    }
    callback(null, questionSessions[id]);
  },

  createQuestion: function(id, question, callback) {
    if (!id) {
      return callback(new Error('Question session id required'));
    }
    if (!question) {
      return callback(new Error('Question is required'));
    }
    question.questionSessionId = id;
    Question.create(question, function(err, createdQuestion) {
      if (err) {
        return callback(err);
      }
      questionSessions[id].questionIds.push(createdQuestion.id);
      callback(null, createdQuestion);
    });
  },

  questions: function(id, callback) {
    if (!id) {
      return callback(new Error('Question session id required'));
    }
    if(!questionSessions[id]) {
      return callback(new Error('Question session does not exist'));
    }
    Question.read(questionSessions[id].questionIds, callback);
  }
};
