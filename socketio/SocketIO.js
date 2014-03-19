var io = require('socket.io').listen(8000);

io.sockets.on('connection', function(socket) {
    io.sockets.emit('this', { will: 'be recieved by everyone'});
    
    socket.on('private message', function(from, msg) {
        console.log('I recieved a private message by ', from, 'saying ', msg);
    });

    socket.on('disconnect', function() {
        io.sockets.emit('user disconnected');
    });
});
