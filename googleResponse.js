/* Creating a file write stream and piping the response body in to it.
 * As body data arrives from server response, it's written in to a file.
 * When the body ends, the file stream is ended, which closes the file.
 *
 *
 */


var http = require('http');
var fs = require('fs');

var options = {
    host: "www.google.com",
    port: 80,
    path: "/",
    method: "GET"
};

var file = fs.createWriteStream('/tmp/test.txt');

http.request(options, function(res) {
    res.pipe(file);
}).end();
