var QuestionSession = require('../app/questionSession');
var expect = require('chai').expect;

describe('Question Session', function() {
  describe('#create', function() {
    it('supplies id of new empty session', function(done) {
      QuestionSession.create(function(err, sessionId) {
        QuestionSession.read(sessionId, function(err, session) {
          expect(session).to.be.an.array;
          done();
        });
      });
    });
  });

  describe('#read', function() {
    beforeEach(function(done) {
      QuestionSession.create(function(err, sessionId) {
        this.sessionId = sessionId;
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
      QuestionSession.read(this.sessionId, function(err, session) {
        expect(session).to.be.an.array;
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

  describe('#questions', function() {
    beforeEach(function(done) {
      QuestionSession.create(function(err, sessionId) {
        this.sessionId = sessionId;
        done();
      }.bind(this));
    });

    it('requires an id parameter', function(done) {
      QuestionSession.questions(null, function(err, session) {
        expect(err).to.be.an.instanceof(Error);
        done();
      });
    });

    xit('supplies an array of Question objects', function(done) {
      QuestionSession.questions(function(err, questions) {
        expect(questions).to.be.an.array;
        done();
      });
    });
  });
});
