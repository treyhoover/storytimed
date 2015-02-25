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

var routes = require('./config/routes')(app);

var server = app.listen(3000, function () {
    console.log('Server running on http://localhost:3000');
});