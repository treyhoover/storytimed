var socket = require('socket.io');
var _ = require('underscore');

module.exports = function(serv) {
    players = [];
    io = socket.listen(serv);
    io.emit('disconnect');
    var Timer = require('./timer')();
    timer = new Timer(30000);

    io.on('connection', function(socket){
        var user = socket.handshake.query.user;
        console.log(user + ' connected');

        var playerCountBefore = players.length;

        players.push({name: user, active: false});

        // when there's just one player, start the first round and make that player active
        if (playerCountBefore == 0) {
            timer.start();
            players[0].active = true;
            timer.newRound();
        }

        if (players.length <= 1 && !timer.stopped) {
            timer.stop();
            console.log("timer stopped:", timer.stopped);
        } else if (players.length > 1 && timer.stopped) {
            timer.start();
            console.log("timer stopped:", timer.stopped);
        }

        io.emit('add_player', user, players,{ for: 'everyone' });
        io.emit('players', players, { for: 'everyone'});

        socket.on('disconnect', function(){
            console.log(user + ' disconnected');
            var player = _.find(players, function(player){
                return player.name == user;
            });

            var index = _.indexOf(players, player);
            if (index > -1) {
                players.splice(index, 1);
            }

            if (players.length <= 1 && !timer.stopped) {
                timer.stop();
                console.log("timer stopped:", timer.stopped);
            } else if (players.length > 1 && timer.stopped) {
                timer.start();
                console.log("timer stopped:", timer.stopped);
            }

            // when there's just one player, make that player active
            if (players.length == 1) {
                players[0].active = true;
            }

            io.emit('remove_player', user, players,{ for: 'everyone' });
            if (player.active) timer.newRound();
        });
    });

    return io;
};
