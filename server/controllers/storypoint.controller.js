var model = require('../models/storypoint');

module.exports = {
    newStoryPoint: function(body, callback){
        var newStoryPoint = new model(body.storyPoint);
        console.log(newStoryPoint);
        newStoryPoint.save(callback);
    },
    show: function(storyId, callback){
        model.find({storyId: storyId}, function(err, doc) {
            callback({
                storyPoints: doc
            });
        });
    }
};