var express = require('express');
var app = express();
var serv = require('http').createServer(app);
var socket = require('./server/sockets')(serv);

var mongoose = require('mongoose');
var uri = process.env.MONGOLAB_URI || 'mongodb://localhost/storytimed';
mongoose.connect(uri);

var bodyParser = require('body-parser');
var path = require('path');

app.set('view engine', 'jade');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

var routes = require('./server/routes')(app);

serv.listen(process.env.PORT || 5000, function () {
    console.log('Server running on *:' + (process.env.PORT || '5000'));
});