var http = require('http');
var url = require('url');
var fs = require('fs');
var server;

server = http.createServer(function(req, res) {
    // the normal code goes here
    var path = url.parse(req.url).pathname;
    switch(path) {
        case '/':
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(
                '<h1> hello!, try the <a href="/test.html"> Test Page </a></h1>'
            );
            res.end();
            break;
        case '/test.html':
            fs.readFile(__dirname + path, function(err, data) {
                if (err) { return send404(res); }
                res.writeHead(200,
                          {'Content-Type': path == 'json.js' ? 'text/javascript' : 'text/html'
                          });
                res.write(data, 'utf8');
                res.end();
        });
        break;
        default: send404(res);
    }
}),

send404 = function(res) {
    res.writeHead(404);
    res.write('404');
    res.end();
};

server.listen(8001);

/*
 *
 */

var io = require('socket.io').listen(server);
io.set('log level', 2);

io.sockets.on('connection', function(socket) {
    // send data to the client
    // emit date to the socket every second
    setInterval(function() {
        socket.emit('date', {'date': new Date()});
    }, 1000);

    // listen for client data
    socket.on('client_data', function(data) {
        process.stdout.write(data.letter);
    });
});
