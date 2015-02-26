var model = require('../models/story');

module.exports = {
    newStory: function(body, callback){
        var newStory = new model(body);
        console.log(body);
        newStory.save(callback);
    },
    find: function(){
        model.find(function(err, doc){
            callback({
                stories: doc
            });
        });
    }
};