var express = require('express');

var app = express();
var path = require('path')

app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
    res.render('index', { title: 'Hey', message: 'Hello there!'});
})

var server = app.listen(3000, function () {

    var host = 'localhost';
    var port = '3000';

    console.log('Example app listening at http://%s:%s', host, port)

});