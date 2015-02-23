var express = require('express');

var app = express();
var path = require('path');

app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
    res.render('index', { title: 'Hey', message: 'Hello there!'});
});

app.get('/story/:id', function(req, res) {
    // req.params.id returns :id
    res.json({
        storyPoints: [
            {author: 'Trey', body: 'Once upon a time there was a group of aspiring developers.'},
            {author: 'Aurora', body: 'They thought they were signing up for code school, but they were signing up for so much more.'},
            {author: 'Andy', body: 'Little did they know, their lives would soon be at stake.'},
            {author: 'Emily', body: 'And so it began: The Coder Games.'}
        ]
    });
});

var server = app.listen(3000, function () {
    console.log('Example app listening at http://localhost:3000');
});