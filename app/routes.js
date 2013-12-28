var QuestionSession = require('./questionSession');

var loginRequired = function(req, res, next) {
  if (req.user) {
    next();
  }
  else {
    req.session.redirectPath = req.url;
    res.redirect('/auth/twitter');
  }
};

module.exports = function(app, config) {
  app.get('/', function(req, res) {
    res.render(req.user ? 'dashboard' : 'index');
  });

  app.post('/', loginRequired, function(req, res) {
    QuestionSession.create({
      userId: req.user.id
    }, function(err, questionSession) {
      res.redirect('/' + questionSession.id);
    });
  });

  app.get('/:id', loginRequired, function(req, res, next) {
    QuestionSession.read(req.params.id, function(err, questionSession) {
      if (questionSession) {
        return res.render('questionSession');
      }
      next();
    });
  });

  app.post('/:id', loginRequired, function(req, res, next) {
    Question.create({
      questionSessionId: req.params.id,
      text: req.params.question,
      user: req.user
    }, function(err, question) {
      if (question) {
        return res.render('questionSession');
      }
    });
  });

  app.get('*', function(req, res) {
    res.status(404).render('404');
  });
};
