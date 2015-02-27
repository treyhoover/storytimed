var Story = require('./controllers/story.controller');
var StoryPoint = require('./controllers/storypoint.controller');
var sockets = require('./sockets');

module.exports = function(app) {

    app.get('/', function(req, res) {
        res.setHeader('Content-Type', 'text/html');
        res.render('index', { title: 'Storytimed' });
    });

    app.get('/api/story/show/:id', function(req, res) {
        var storyId = parseInt(req.params.id);
        StoryPoint.show(storyId, function(storyPoints){
            res.json(storyPoints);
        });
    });

    app.post('/api/story/create', function(req, res){
        Story.newStory(req.body, function(err, newStory){
            if (err) {
                res.status(400).end(JSON.stringify({error: "Error creating story"}));
                return console.error(err);
            } else {
                res.status(200).end(JSON.stringify({success: "Successfully created story"}));
            }
        });
    });

    app.get('/api/story/index', function(req, res){
        Story.find(function(stories){
            res.json(stories);
        });
    });

    app.post('/api/story/add', function(req, res){
        StoryPoint.newStoryPoint(req.body, function(err, newStoryPoint){
            if (err || newStoryPoint.body.length < 1 || newStoryPoint.author.length < 1) {
                res.status(400).end(JSON.stringify({error: "Error adding entry"}));
                return console.error(err);
            } else {
                io.emit('new storyPoint', newStoryPoint,{ for: 'everyone' });
                timer.newRound();
                res.status(200).end(JSON.stringify({success: "Successfully added"}));
            }
        });
    });
};