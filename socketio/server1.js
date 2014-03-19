var io = require('socket.io').listen(8080);

io.sockets.on('connection', function(socket) {
    socket.on('my event', function(content) {
        console.log(content);
    });
});
