var express = require('express');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/storytimed');

var storySchema = {
    title: {type: String, default: 'untitled'},
    players: []
};

var storyPointSchema = {
    storyId: Number,
    author: {type: String, default: 'anonymous'},
    body: {type: String, default: ''},
    timestamp: { type: Date, default: Date.now }
};

var Story = mongoose.model('Story', storySchema, 'stories');
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
    res.render('index', { title: 'Storytimed' });
});

app.get('/api/story/show/:id', function(req, res) {
    var storyId = parseInt(req.params.id);
    StoryPoint.find({storyId: storyId}, function(err, doc) {
        res.json({
            storyPoints: doc
        });
    });
});

app.post('/api/story/create', function(req, res){
    var newStory = new Story(req.body);
    console.log(req.body);
    newStory.save(function(err, newStory){
        if (err) {
            res.status(400).end(JSON.stringify({error: "Error creating story"}));
            return console.error(err);
        } else {
            res.status(200).end(JSON.stringify({success: "Successfully created story"}));
        }
    });
});

app.get('/api/story/index', function(req, res){
   Story.find(function(err, doc){
      res.json({
         stories: doc
      });
   });
});

app.post('/api/story/add', function(req, res){
    var newStoryPoint = new StoryPoint(req.body.storyPoint);
    console.log(newStoryPoint);
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