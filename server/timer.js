var _ = require('underscore');
var sockets = require('./sockets.js');

module.exports = function() {

    var Timer = function(interval){
        this.round = 0;
        this.stopped = true;
        this.interval = interval;
        this.intervalId = null;
        this.timeRemaining = interval;
        this.countDown = function() {

            io.emit('time_remaining', this.timeRemaining, { for: 'everyone' });

            this.timeRemaining -= 1;
            if (this.timeRemaining < 0) {
                //console.log('time\'s up!');
                this.timeRemaining = interval/1000;
                this.newRound();
            }

            io.emit('time_remaining', this.timeRemaining, { for: 'everyone' });

        }.bind(this);
        this.newRound = function(){
            this.round += 1;
            this.timeRemaining = interval/1000;

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
            this.timeRemaining = interval/1000;
            this.intervalId = setInterval(this.countDown, 1000);
            this.stopped = false;
        };
        this.stop = function() {
            clearInterval(this.intervalId);
            this.stopped = true;
            io.emit('time_remaining', this.timeRemaining, { for: 'everyone' });
        };
    };

    return Timer;
};