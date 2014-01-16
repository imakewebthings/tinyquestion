var express = require('express');
var path = require('path');
var redis = require('redis').createClient();
var RedisStore = require('connect-redis')(express);
var persistence = require('./persistence')('redis');
var maxSessionAge = 1000 * 60 * 60 * 24 * 100; // 100 days
require('http').globalAgent.maxSockets = 200;

var setupSockets = function(app) {
  app.io.on('connection', function(socket) {
    socket.on('joinRoom', function(room) {
      socket.join(room);
    });
  });
};

module.exports = function(app, config) {
  persistence.setClient(redis);
  setupSockets(app);
  app.set('views', path.resolve(__dirname, '..', 'views'));
  app.set('view engine', 'jade');
  app.set('view options', { layout: false });
  app.use(express.static(path.resolve(__dirname, '..', 'public')));
  app.use(express.favicon(
    path.resolve(__dirname, '..', 'public', 'img', 'favicon.ico')
  ));
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({
    secret: config.get('COOKIE_SECRET'),
    key: config.get('COOKIE_KEY'),
    store: new RedisStore({ client: redis }),
    cookie: { maxAge: maxSessionAge }
  }));
  require('./auth')(app, config, redis);
  app.use(app.router);
};
