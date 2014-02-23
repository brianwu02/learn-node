var net = require('net');
var server = net.createServer();
var sockets = [];
/* TCP servers emit certain events during its lifecycle. 
 * 'Listening' event when you set it to listen on a certain port.
 * 'close' events when it gets closed
 * 'error' events when an error occurs.
 * 'connection' events occur when a new client connects.
 * socket objects are served by the connection which are both readable and writable stream.
 * sockets can be used to listen for data, send data, end connection,
 * and pipe the connection to another stream.
 *
 * socket object can be controlled by using socket.pause() and socket.resume()
 * socket connection can also be tweaked by sending keep-alive packet
 * 
*/



server.on('connection', function(socket) {
    console.log('got a new connection');

    sockets.push(socket);

    socket.on('data', function(data) {
        console.log('got data:', data);
        sockets.forEach(function(otherSocket) {
            if (otherSocket !== socket) {
                otherSocket.write(data);
            }
        });
    });
});

server.on('error', function(err) {
    console.log('Server error:', err.message);
});

server.on('close', function() {
    console.log('server closed');
    var index = sockets.indexOf(socket)
    sockets.splice(index, 1);
});

server.listen(4001);
