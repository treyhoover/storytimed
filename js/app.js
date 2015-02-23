(function() {
    var app = angular.module('storytimed', []);

    app.directive('gameContainer', ['$http', function($http){
        return {
            controllerAs: 'game',
            restrict: 'E',
            templateUrl: 'game-container.html',
            controller: function(){
                this.settings = {
                    title: "The Coder Games",
                    players: ['Trey', 'Aurora', 'Andy', 'Emily']
                }
            }
        }
    }]);

    app.controller('StoryController', function(){
        this.point = {};

        this.addPoint = function(story) {
            story.points.push(this.point);
            this.point = {};
        };

        this.points = [
            {author: 'Trey', body: 'Once upon a time there was a group of aspiring developers.'},
            {author: 'Aurora', body: 'They thought they were signing up for code school, but they were signing up for so much more.'},
            {author: 'Andy', body: 'Little did they know, their lives would soon be at stake.'},
            {author: 'Emily', body: 'And so it began: The Coder Games.'}
        ]
    });
})();