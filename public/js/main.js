(function() {
    var app = angular.module('storytimed', []);

    app.directive('gameContainer', function(){
        return {
            restrict: 'E',
            templateUrl: 'partials/game-container.html',
            controller: function(){
                this.settings = {
                    title: "The Coder Games",
                    players: ['Trey', 'Aurora', 'Andy', 'Emily']
                }
            },
            controllerAs: 'game'
        }
    });

    app.controller('StoryController', ['$http', function($http){
        var story = this;

        this.point = {};

        this.addPoint = function(story) {
            $http({
                url: '/api/story/add',
                method: "POST",
                dataType: 'json',
                headers: {
                    "Content-Type": "application/json"
                },
                data: {
                    storyPoint: {
                        author: this.point.author || 'anonymous',
                        body: this.point.body || ''
                    }
                }
            }).success(function (data, status, headers, config) {
                console.log(data);
                story.points.push(story.point);
                story.point = {};
            }).error(function (data, status, headers, config) {
                console.log(data);
            });
        };

        $http.get('/api/story/1')
            .success(function(response){
                story.points = response.storyPoints;
            });
    }]);
})();