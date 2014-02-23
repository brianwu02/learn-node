require('net').createServer(function(socket) {
    var rs = require('fs').createReadStream('hello.txt');
    // pipe rs in to socket
    rs.pipe(socket);
}).listen(4001);

