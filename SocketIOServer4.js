var http = require('http');
var url = require('url');
var fs = require('fs');
var io = require('socket.io');


var server = http.createServer(function(req, res) {
    console.log('Connection');
    var path = url.parse(req.url).pathname;
    console.log('request path:', path);
    
    switch(path){
        case '/':
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write('hello world! ');
            break;
        case 'socket.html':
            fs.readFile(__dirname + path, function(err, data) {
                if (err) {
                    res.writeHead(404);
                    res.write('oops, this doenst exist - 404');
                }
                else {
                    res.writeHead(200, {'Content-Type': 'text/html' });
                    res.write(data, 'utf8');
                }
            });
            break;
        default:
            res.writeHead(404);
            res.write('this does not exist');
            break;
    }
    res.end();
});
        

server.listen(8000);
io.listen(server);
