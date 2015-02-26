var mongoose = require('mongoose');

var storySchema = {
    title: {type: String, default: 'untitled'},
    players: []
};

var Story = module.exports = mongoose.model('Story', storySchema, 'stories');