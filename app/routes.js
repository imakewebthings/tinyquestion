module.exports = function(app, config) {
  app.get('/', function(req, res) {
      res.render(req.user ? 'dashboard' : 'index');
  });
};
