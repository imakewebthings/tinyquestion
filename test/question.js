var Question = require('../app/question');
var expect = require('chai').expect;
var mockQuestion = require('./mock/question');

describe('Question', function() {
  afterEach(function(done) {
    Question.destroyAll(done);
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
          done();
        }.bind(this));
      });

      it('supplies array of questions', function(done) {
        Question.read([
          this.question.id,
          'does-not-exist',
          this.secondQuestion.id
        ], function(err, questions) {
          expect(questions).to.deep.equal([this.question, this.secondQuestion]);
          done();
        }.bind(this));
      })
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

    it('supplies undefined if question does not exist', function(done) {
      Question.destroy('does-not-exist', function(err, question) {
        expect(question).to.not.exist;
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

    describe('with multiple ids', function() {
      beforeEach(function(done) {
        Question.create(mockQuestion(), function(err, question) {
          this.secondQuestion = question;
          Question.destroy([
            this.question.id,
            this.secondQuestion.id
          ], function(err, questions) {
            this.suppliedQuestions = questions;
            done();
          }.bind(this));
        }.bind(this));
      });

      it('deletes all ids specified', function(done) {
        Question.read([
          this.question.id,
          this.secondQuestion.id
        ], function(err, questions) {
          expect(questions).to.be.empty;
          done();
        });
      });

      it('supplies the deleted questions', function() {
        expect(this.suppliedQuestions).to.deep.equal([
          this.question,
          this.secondQuestion
        ]);
      })
    });
  });

  describe('#upvote', function() {
    beforeEach(function(done) {
      Question.create(mockQuestion(), function(err, question) {
        this.question = question;
        done();
      }.bind(this));
    });

    it('requires id', function(done) {
      Question.upvote(null, function(err) {
        expect(err).to.be.an.instanceof(Error);
        done();
      });
    });

    it('errors if question does not exist', function(done) {
      Question.upvote('no-exist', function(err) {
        expect(err).to.be.an.instanceof(Error);
        done();
      });
    });

    it('supplies upvoted question with updated votes', function(done) {
      Question.upvote(this.question.id, function(err, question) {
        expect(question.votes).to.equal(1);
        done();
      });
    });
  });
});
