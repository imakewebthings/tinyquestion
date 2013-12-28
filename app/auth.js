var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;

module.exports = function(app, config, redis) {
  var strategyOptions = {
    consumerKey: config.get('TWITTER_CONSUMER_KEY'),
    consumerSecret: config.get('TWITTER_CONSUMER_SECRET'),
    callbackURL: config.get('TWITTER_CALLBACK_URL')
  };
  var verification = function(token, tokenSecret, profile, done) {
    var user = {
      id: profile.id,
      displayName: profile.displayName,
      photo: profile.photos[0].value
    };
    redis.hmset('user' + profile.id, user);
    done(null, user);
  };

  passport.use(new TwitterStrategy(strategyOptions, verification));
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  passport.deserializeUser(function(id, done) {
    redis.hgetall('user' + id, function(err, user) {
      done(null, user);
    });
  });

  app.use(passport.initialize());
  app.use(passport.session());

  app.get('/auth/twitter', passport.authenticate('twitter'));

  app.get('/auth/twitter/callback', passport.authenticate('twitter', {
    failureRedirect: '/'
  }), function(req, res) {
    if (req.session.redirectPath) {
      var path = req.session.redirectPath;
      req.session.redirectPath = null;
      res.redirect(path);
    }
    else {
      res.redirect('/');
    }
  });

  app.get('/auth/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });
};
