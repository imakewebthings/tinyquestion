var QuestionSession = require('./questionSession');
var Question = require('./question');

var loginRequired = function(req, res, next) {
  if (req.user) {
    next();
  }
  else {
    req.session.redirectPath = req.url;
    res.redirect('/auth/twitter');
  }
};

var getQuestionSession = function(req, res, next) {
  QuestionSession.read(req.params.id, function(err, questionSession) {
    if (err || !questionSession) {
      return res.status(404).render('404');
    }
    req.questionSession = questionSession;
    next();
  });
};

var getQuestions = function(req, res, next) {
  QuestionSession.questions(req.params.id, function(err, questions) {
    if (err) {
      return res.status(404).render('404');
    }
    req.questions = questions.sort(function(a, b) {
      return parseInt(b.votes, 10) - parseInt(a.votes, 10);
    });
    next();
  });
};

module.exports = function(app, config) {
  app.get('/', function(req, res) {
    res.render(req.user ? 'dashboard' : 'index');
  });

  app.post('/', loginRequired, function(req, res) {
    QuestionSession.create(function(err, questionSession) {
      res.redirect('/' + questionSession.id);
    });
  });

  app.get(
    '/:id',
    loginRequired,
    getQuestionSession,
    getQuestions,
    function(req, res, next) {
      return res.render('questionSession', {
        questionSession: req.questionSession,
        questions: req.questions
      });
    }
  );

  app.post('/:id', loginRequired, function(req, res, next) {
    QuestionSession.createQuestion(req.params.id, {
      text: req.body.question,
      user: req.user
    }, function(err, question) {
      res.redirect('/' + req.params.id);
    });
  });

  app.post('/questions/:id', loginRequired, function(req, res, next) {
    Question.upvote(req.params.id, function(err, question) {
      res.redirect('/' + question.questionSessionId);
    });
  });

  app.get('*', function(req, res) {
    res.status(404).render('404');
  });
};
