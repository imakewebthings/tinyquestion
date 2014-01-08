var _ = require('lodash');
var crypto = require('crypto');
var async = require('async');
var Question = require('./question');
var persistence = require('./persistence')();

var generateId = function(callback) {
  crypto.randomBytes(2, function(err, buffer) {
    if (err) {
      throw err;
    }
    var id = buffer.toString('hex');
    persistence.readHash('questionSession', id, function(err, session) {
      if (session) {
        return generateId(callback);
      }
      callback(null, id);
    });
  });
};

module.exports = {
  create: function(callback) {
    generateId(function(err, id) {
      var questionSessionHash = {
        id: id
      };
      async.parallel([
        function putQuestionSessionHash(cb) {
          persistence.putHash('questionSession', id, questionSessionHash, cb);
        },
        function putQuestionList(cb) {
          persistence.createEmptyList('questionSession:questions', id, cb);
        }
      ], function(err, results) {
        if (err) {
          return callback(err);
        }
        callback(null, questionSessionHash);
      });
    });
  },

  read: function(id, callback) {
    if (!id) {
      return callback(new Error('Question session id required'));
    }
    persistence.readHash('questionSession', id, callback);
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
      persistence.listAppend(
        'questionSession:questions',
        id,
        createdQuestion.id,
        function(err, questionIdList) {
          if (err) {
            return callback(err);
          }
          callback(null, createdQuestion);
        }
      );
    });
  },

  questions: function(id, callback) {
    if (!id) {
      return callback(new Error('Question session id required'));
    }
    persistence.readList('questionSession:questions', id, function(err, ids) {
      Question.read(ids, function(err, questions) {
        callback(err, _.compact(questions));
      });
    });
  }
};
