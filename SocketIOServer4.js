var http = require('http');
var url = require('url');
var fs = require('fs');
var server;

var server = http.createServer(function(req, res) {
    console.log('Connection');
    var path = url.parse(req.url).pathname;
    switch(path){
        case '/':
            console.log('inside the '/' case');
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write('hello world! ');
            break;
        case '/socket.html':
            console.log('inside the socket.html case');
            fs.readFile(__dirname + '/socket.html', function(err, data) {
                if (err) { return send404(res); }
                else {
                    console.log('doing the else');
                    res.writeHead(200, {'Content-Type': 'text/html' });
                    res.write(data, 'utf8');
                }
            });
            console.log('breaking from /socket.html ');
            break;
        default:
            res.writeHead(404);
            res.write('this does not exist');
            break;
    }
    console.log(' at res.end()');
    res.end();
});
        
server.listen(8001);
var io = require('socket.io').listen(server);
io.set('log level', 3);


io.sockets.on('connection', function(socket) {
    socket.emit('message', {'message': 'hello world'});
});

