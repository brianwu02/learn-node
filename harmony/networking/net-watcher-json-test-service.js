var net = require('net');
var server = net.createServer(function(connection) {
  console.log('Subscriber connected.');

  // send the first chunk
  connection.write(
    '{"type":"changed","file": "file'
  );

  var timer = setTimeout(function() {
    connection.write('.txt", "timestamp":1358175758495}' + "\n");
    connection.end();
  }, 1000);

  // clear timer when the connection ends
  connection.on('end', function() {
    clearTimeout(timer);
    console.log('Subscriber disconnected');
  });
});

server.listen(8080, function() {
  console.log('Test server listening for subscribers...');
});
