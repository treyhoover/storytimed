(function() {
    var app = angular.module('storytimed', []);
    var socket = io.connect('http://localhost:8000');

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

    app.controller('StoryController', ['$http', '$scope', function($http, $scope){
        var story = this;

        this.username = "anonymous";
        this.point = {};

        socket.on('new storyPoint', function(msg){
            //console.log('new storyPoint!', msg);
            story.points.push(msg);
            //console.log('last story point:', story.points[story.points.length - 1]);
            $scope.$apply();
            $('.story').scrollTop($('.story')[0].scrollHeight);
        });

        socket.on('change players', function(msg){
            console.log('change players', 'round ' + msg);
        });

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
                        storyId: this.point.storyId || 1,
                        author: story.username || '',
                        body: this.point.body || ''
                    }
                }
            }).success(function (data, status, headers, config) {
                //console.log(data);
                //story.points.push(story.point);
                story.point = {};
            }).error(function (data, status, headers, config) {
                console.log(data);
            });
        };

        $http.get('/api/story/show/1')
            .success(function(response){
                //console.log("Successfully fetched story points", response.storyPoints);
                story.points = response.storyPoints;
            });
    }]);
})();