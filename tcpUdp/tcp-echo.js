var server = require('net').createServer(function(socket) {
    console.log('new connection');

    socket.setEncoding('utf8');
    socket.write("Hallo you can start typing here. type 'quit' to exit.\n");

    socket.on('data', function(data) {
        console.log('got:', data.toString());
        if (data.trim().toLowerCase() === 'quit') {
            socket.write('bye bye, quitting');
            return socket.end();
        }
        socket.write(data);
    });

    socket.on('end', function() {
        console.log('client connection closed');
    });
}).listen(4001);
