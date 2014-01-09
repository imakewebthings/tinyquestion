var express = require('express');
var app = express();
var server = require('http').createServer(app);
var config = require('nconf').argv().env().file('config.json');

app.io = require('socket.io').listen(server);

require('./app/settings')(app, config);
require('./app/routes')(app, config);

server.listen(config.get('PORT'));
