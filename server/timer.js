var _ = require('underscore');
var sockets = require('./sockets.js');

module.exports = function() {

    var Timer = function(interval){
        this.round = 0;
        this.stopped = true;
        this.interval = interval;
        this.intervalId = null;
        this.newRound = function(){
            this.round += 1;

            // update active player status for each player when rounds change
            var previousActivePlayer = _.find(players, function(player){
               return player.active;
            });

            var nextActivePlayerIndex = players.indexOf(previousActivePlayer) + 1;

            nextActivePlayerIndex = (nextActivePlayerIndex >= players.length) ?  0 : nextActivePlayerIndex;

            var activePlayerIndex = nextActivePlayerIndex;
            _.each(players, function(player, index){
                player.active = (index == activePlayerIndex);
            });

            io.emit('new_round', this.round, players, activePlayerIndex, { for: 'everyone' });
            return this.round;
        }.bind(this);
        this.start = function() {
            this.intervalId = setInterval(this.newRound, interval);
            this.stopped = false;
        };
        this.stop = function() {
          clearInterval(this.intervalId);
            this.stopped = true;
        };
    };

    return Timer;
};