var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();

app.set('view engine', 'jade');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.render('index', { title: 'Storytimed', message: 'Hello there!'});
});

app.get('/api/story/:id', function(req, res) {
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

app.post('/api/story/add', function(req, res){
    var storyPoint = req.body;
    console.log(storyPoint);
    res.status(200).end(JSON.stringify({success: "Successfully added"}));
    //res.status(400).end(JSON.stringify({error: "Error adding entry"}));
});

var server = app.listen(3000, function () {
    console.log('listening at http://localhost:3000');
});