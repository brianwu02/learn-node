var fs = require('fs');

require('http').createServer(function(req, res) {
    res.writeHead(200, {
        'Content-Type': 'video/mp4'
    });
    var rs = fs.createReadStream('codeschool_335.mp4');
    // pipe the read stream to response object.
    rs.pipe(res);
}).listen(4000);
