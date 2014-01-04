var QuestionSession = require('../app/questionSession');
var expect = require('chai').expect;
var mockQuestion = require('./mock/question');
var Question = require('../app/question');
var async = require('async');

describe('Question Session', function() {
  describe('#create', function() {
    it('supplies new empty session', function(done) {
      QuestionSession.create(function(err, createdSession) {
        QuestionSession.read(createdSession.id, function(err, session) {
          expect(session).to.deep.equal(createdSession);
          done();
        });
      });
    });
  });

  describe('#read', function() {
    beforeEach(function(done) {
      QuestionSession.create(function(err, session) {
        this.session = session;
        done();
      }.bind(this));
    });

    it('requires an id parameter', function(done) {
      QuestionSession.read(null, function(err, session) {
        expect(err).to.be.an.instanceof(Error);
        done();
      });
    });

    it('supplies the session with the given id', function(done) {
      QuestionSession.read(this.session.id, function(err, session) {
        expect(session).to.deep.equal(this.session);
        done();
      }.bind(this));
    });

    it('supplies undefined if session id does not exist', function(done) {
      QuestionSession.read('does-not-exist', function(err, session) {
        expect(session).not.to.exist;
        expect(err).not.to.exist;
        done();
      });
    });
  });

  describe('#createQuestion', function() {
    beforeEach(function(done) {
      QuestionSession.create(function(err, session) {
        this.session = session;
        QuestionSession.createQuestion(
          this.session.id,
          mockQuestion(),
          function(err, question) {
            this.createdQuestion = question;
            done();
          }.bind(this)
        );
      }.bind(this));
    });

    it('requires session id', function(done) {
      QuestionSession.createQuestion(null, mockQuestion(), function(err) {
        expect(err).to.be.an.instanceof(Error);
        done();
      });
    });

    it('requires a question', function(done) {
      QuestionSession.createQuestion(this.session.id, null, function(err) {
        expect(err).to.be.an.instanceof(Error);
        done();
      });
    });

    it('requires a valid question', function(done) {
      QuestionSession.createQuestion(
        this.session.id,
        mockQuestion({ text: null }),
        function(err) {
          expect(err).to.be.an.instanceof(Error);
          done();
        }
      );
    });

    it('adds question id to session question id list', function() {
      expect(this.session.questionIds).to.contain(this.createdQuestion.id);
    });

    it('supplies newly created question', function() {
      expect(this.createdQuestion.questionSessionId).to.equal(this.session.id);
    });
  });

  describe('#questions', function() {
    beforeEach(function(done) {
      QuestionSession.create(function(err, session) {
        this.session = session;
        async.times(3, function(n, next) {
          QuestionSession.createQuestion(session.id, mockQuestion(), next);
        }, function(err, questions) {
          done();
        });
      }.bind(this));
    });

    it('requires an id parameter', function(done) {
      QuestionSession.questions(null, function(err, questions) {
        expect(err).to.be.an.instanceof(Error);
        done();
      });
    });

    it('errors if question session does not exist', function(done) {
      QuestionSession.questions('not-exist', function(err, questions) {
        expect(err).to.be.an.instanceof(Error);
        done();
      });
    });

    it('supplies an array of Question objects', function(done) {
      QuestionSession.questions(this.session.id, function(err, questions) {
        expect(questions).to.have.length(3);
        done();
      }.bind(this));
    });
  });
});
