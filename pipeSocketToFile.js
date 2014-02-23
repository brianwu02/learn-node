var ws = require('fs').createWriteStream('sample.txt');

require('net').createServer(function(socket) {
    socket.pipe(ws);
}).listen(4001);



