var socket = require('socket.io');
var players = [];

module.exports = function(serv) {
    io = socket.listen(serv);

    io.on('connection', function(socket){

        var user = socket.handshake.query.user;
        console.log(user + ' connected');
        players.push(user);

        if (players.length == 0) {
            var round = timer.changePlayer();
            io.emit('change players', round, { for: 'everyone' });
        }

        io.emit('add player', user, players,{ for: 'everyone' });

        socket.on('activePlayerName', function(name){
            io.emit('set activePlayer', name, { for: 'everyone'});
        });

        socket.on('disconnect', function(){
            console.log(user + ' disconnected');
            var index = players.indexOf(user);
            if (index > -1) {
                players.splice(index, 1);
            }
            io.emit('remove player', user, players,{ for: 'everyone' });
        });
    });

    var Timer = require('./timer')(io);
    var timer = new Timer(30000);
    timer.start();

    return io;
};
