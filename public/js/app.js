(function() {
    var app = angular.module('storytimed', []);

    app.directive('gameContainer', function($location){
        return {
            restrict: 'E',
            templateUrl: 'partials/game-container.html',
            controller: ['$scope', function($scope){
                $scope.username = $location.search().user;

                if (!$scope.username) {
                    $scope.username = prompt('What\'s your name?', '') || 'Anonymous';
                    $location.search({user: $scope.username});
                }

                var socket = io.connect({query: 'user=' + $scope.username});

                var self = this;
                this.settings = {
                    title: "The Coder Games",
                    players: [],
                    activePlayer: {},
                    timeRemaining: 1,
                    clientIsActive: false
                }

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

                    if (activePlayer.name == $scope.username) {
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
})();