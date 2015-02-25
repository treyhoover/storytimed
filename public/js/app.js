(function() {
    var app = angular.module('storytimed', []);
    var socket = io.connect('http://localhost:8000');

    app.directive('gameContainer', function(){
        return {
            restrict: 'E',
            templateUrl: 'partials/game-container.html',
            controller: ['$scope', function($scope){
                var self = this;
                this.settings = {
                    title: "The Coder Games",
                    players: ['Trey', 'Aurora', 'Andy', 'Emily'],
                    activePlayer: false
                };
                socket.on('change players', function(round){
                    //console.log('change players', 'round ' + round);
                    var players = self.settings.players;
                    var pI = parseInt(round) % players.length;

                    if (players[pI] == 'Trey') {
                        self.settings.activePlayer = true;
                        $scope.$apply();
                        console.log('You\'re up!');
                    } else {
                        self.settings.activePlayer = false;
                        $scope.$apply();
                        console.log(players[pI] + ' is up!');
                    }
                });
            }],
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