var express = require('express');
var app = express();
var config = require('nconf').argv().env().file('config.json');

require('./app/settings')(app, config);
require('./app/routes')(app, config);
app.listen(config.get('PORT'));
