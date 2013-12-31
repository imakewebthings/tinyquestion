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
  afterEach(function() {
    Question.destroyAll();
  });

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

  describe('#read', function() {
    beforeEach(function(done) {
      Question.create(mockQuestion(), function(err, question) {
        this.question = question;
        done();
      }.bind(this));
    });

    describe('with a single id', function() {
      it('requires an id', function(done) {
        Question.read(null, function(err, question) {
          expect(err).to.be.an.instanceof(Error);
          done();
        });
      });

      it('supplies undefined if question does not exist', function(done) {
        Question.read('does-not-exist', function(err, question) {
          expect(question).not.to.exist;
          done();
        });
      });

      it('supplies the question when it exists', function(done) {
        Question.read(this.question.id, function(err, question) {
          expect(question).to.deep.equal(this.question);
          done();
        }.bind(this));
      });
    });

    describe('with multiple ids', function() {
      beforeEach(function(done) {
        Question.create(mockQuestion(), function(err, question) {
          this.secondQuestion = question;
        }.bind(this));
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
    });

    it('errors if question does not exist', function(done) {
      Question.destroy('does-not-exist', function(err, question) {
        expect(err).to.be.an.instanceof(Error);
        done();
      })
    });

    describe('when valid', function() {
      beforeEach(function(done) {
        Question.destroy(this.question.id, function(err, question) {
          this.suppliedQuestion = question;
          done();
        }.bind(this));
      });

      it('supplies the deleted question', function() {
        expect(this.suppliedQuestion).to.deep.equal(this.question);
      });

      it('destroys the deleted question', function(done) {
        Question.read(this.question.id, function(err, question) {
          expect(question).not.to.exist;
          done();
        });
      });
    });
  });

  describe('#upvote', function(done) {
    xit('errors if question does not exist', function(done) {
      expect('implemented').to.not.exist;
    });
  });
});
