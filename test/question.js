var Question = require('../app/question');
var expect = require('chai').expect;
var _ = require('lodash');

var mockQuestion = function(properties) {
  var defaults = {
    user: {
      id: 'test-user-id',
      displayName: 'test-user-display-name'
    },
    questionSessionId: 'test-session',
    text: 'test question?'
  };
  return _.extend(defaults, properties);
};

describe('Question', function() {
  describe('#create', function() {
    it('requires a question properties object', function(done) {
      Question.create(null, function(err, question) {
        expect(err).to.be.an.instanceof(Error);
        done();
      })
    });

    it('requires text', function(done) {
      Question.create(mockQuestion({ text: null }), function(err, question) {
        expect(err).to.be.an.instanceof(Error);
        done();
      });
    });

    it('requires a user', function(done) {
      Question.create(mockQuestion({ user: null }), function(err, question) {
        expect(err).to.be.an.instanceof(Error);
        done();
      });
    });

    it('requires a question session id', function(done) {
      Question.create(mockQuestion({
        questionSessionId: null
      }), function(err, question) {
        expect(err).to.be.an.instanceof(Error);
        done();
      });
    });
  });

  describe('#destroy', function() {
    beforeEach(function(done) {
      Question.create(mockQuestion(), function(err, question) {
        this.question = question;
        done();
      }.bind(this));
    });

    it('requires an id', function(done) {
      Question.destroy(null, function(err, question) {
        expect(err).to.be.an.instanceof(Error);
        done();
      });
    })

    it('errors if question does not exist', function(done) {
      Question.destroy('does-not-exist', function(err, question) {
        expect(err).to.be.an.instanceof(Error);
        done();
      })
    });

    it('supplies the deleted question', function(done) {
      Question.destroy(this.question.id, function(err, question) {
        expect(question).to.deep.equal(this.question);
        done();
      }.bind(this));
    });
  });

  describe('#upvote', function(done) {
    xit('errors if question does not exist', function(done) {
      expect('implemented').to.not.exist;
    });
  });
});
