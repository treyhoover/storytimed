var http = require('http');
var socket = require('socket.io');
var socketServer = http.createServer(app);
var io = socket.listen(socketServer);

var express = require('express');

var app = express();

var bodyParser = require('body-parser');
var path = require('path');

app.set('view engine', 'jade');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

var routes = require('./config/routes')(app, io);
var timer = require('./server/timer')(app, io);

var server = app.listen(process.env.PORT || 5000, function () {
    console.log('Server running on *:5000');
});

socketServer.listen(8000);