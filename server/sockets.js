var socket = require('socket.io');
var players = [];

module.exports = function(serv) {
    io = socket.listen(serv);

    io.on('connection', function(socket){
        var user = socket.handshake.query.user;
        console.log(user + ' connected');
        players.push(user);
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

    return io;
};



