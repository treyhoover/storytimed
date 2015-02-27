(function() {
    var app = angular.module('storytimed', []);

    $.urlParam = function(name){
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        if (results==null){
            return null;
        }
        else{
            return results[1] || 0;
        }
    };

    var username = $.urlParam("user");

    if (!username) {
        username = prompt('What\'s your name?', '');
    }

    var socket = io.connect({query: 'user=' + username});

    app.directive('gameContainer', function(){
        return {
            restrict: 'E',
            templateUrl: 'partials/game-container.html',
            controller: ['$scope', function($scope){
                var self = this;
                this.settings = {
                    title: "The Coder Games",
                    players: [],
                    activePlayer: false,
                    activePlayerName: ''
                };
                socket.on('change players', function(round){
                    //console.log('change players', 'round ' + round);
                    var players = self.settings.players;
                    var pI = parseInt(round) % players.length;

                    self.settings.activePlayerName = players[pI];

                    $('.players ul').children().removeClass('active');
                    $('.players ul').children().eq(pI).addClass('active');

                    if (players[pI] == username) {
                        self.settings.activePlayer = true;
                        $scope.$apply();
                        console.log('You\'re up!');
                    } else {
                        self.settings.activePlayer = false;
                        $scope.$apply();
                        console.log(players[pI] + ' is up!');
                    }
                });
                socket.on('players', function(players){
                   console.log('player list', players);
                });
                socket.on('add player', function(player, players){
                    console.log(player + ' has joined the room!');
                    self.settings.players = players;
                    $scope.$apply();
                });
                socket.on('remove player', function(player, players){
                    console.log(player + ' has left the room!');
                    self.settings.players = players;
                    $scope.$apply();
                });
            }],
            controllerAs: 'game'
        }
    });

    app.controller('StoryController', ['$http', '$scope', function($http, $scope){
        var story = this;

        this.username = username;
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