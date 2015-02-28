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
                    activePlayer: {},
                    timeRemaining: 1,
                    clientIsActive: false
                };
                socket.on('time_remaining', function(timeRemaining){
                    self.settings.timeRemaining = timeRemaining;
                    $('.players li').not('.active').find($('.counter')).html("");
                    $('.players li.active').find($('.counter')).html("(" + timeRemaining + ")");
                    $scope.$apply();
                });
                socket.on('new_round', function(round, players, playerIndex){

                    var activePlayer = _.find(players, function(player){
                        return player.active == true;
                    });

                    self.settings.activePlayer = activePlayer;

                    $('ul.players-list').children().removeClass('active');
                    $('ul.players-list').children().eq(playerIndex).addClass('active');

                    if (activePlayer.name == username) {
                        self.settings.clientIsActive = true;
                        $scope.$apply();
                        console.log('You\'re up!');
                    } else {
                        self.settings.clientIsActive = false;
                        $scope.$apply();
                        console.log(players[playerIndex].name + ' is up!');
                    }
                });
                socket.on('add_player', function(player, players){
                    console.log(player + ' has joined the room!');
                    self.settings.players = players;
                    $scope.$apply();
                });
                socket.on('remove_player', function(player, players){
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
            story.points.push(msg);
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
                story.point = {};
            }).error(function (data, status, headers, config) {
                console.log(data);
            });
        };

        $http.get('/api/story/show/1')
            .success(function(response){
                story.points = response.storyPoints;
            });
    }]);
})();