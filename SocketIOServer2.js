var io = require('socket.io').listen(8000);

io.sockets.on('connection', function (socket) {
    socket.on('set nickname', function (name) {
        socket.set('nickname', name, function() {
            socket.emit('ready');
        });
    });

    socket.on('msg', function () {
        socket.get('nickname', function(err, body) {
            console.log('Chat message by ', name);
        });
    });
});
