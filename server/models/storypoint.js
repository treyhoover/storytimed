var mongoose = require('mongoose');

var storyPointSchema = {
    storyId: Number,
    author: {type: String, default: 'anonymous'},
    body: {type: String, default: ''},
    timestamp: { type: Date, default: Date.now }
};

var StoryPoint = module.exports = mongoose.model('StoryPoint', storyPointSchema, 'storypoints');