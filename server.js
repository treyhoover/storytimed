var express = require('express');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/storytimed');

var storyPointSchema = {
    author:String,
    body:String
};

var StoryPoint = mongoose.model('StoryPoint', storyPointSchema, 'storypoints');

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
    //var storyId = req.params.id;
    StoryPoint.find(function(err, doc) {
        res.json({
            storyPoints: doc
        });
    })
});

app.post('/api/story/add', function(req, res){
    var newStoryPoint = new StoryPoint(req.body.storyPoint);
    //console.log(storyPoint);
    newStoryPoint.save(function(err, newStoryPoint){
        if (err) {
            res.status(400).end(JSON.stringify({error: "Error adding entry"}));
            return console.error(err);
        } else {
            res.status(200).end(JSON.stringify({success: "Successfully added"}));
        }
    });
});

var server = app.listen(3000, function () {
    console.log('Server running on http://localhost:3000');
});