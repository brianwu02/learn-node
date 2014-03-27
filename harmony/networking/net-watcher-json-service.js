var fs = require('fs');
var net = require('net');
var filename = process.argv[2];

var server = net.createServer(function(connection) {
  console.log('subscriber connected.');
  //connection.write("Now watching" + filename + " for changes...\n");
  connection.write(JSON.stringify({
    type: 'watching',
    file: filename,
  }) + '\n');

  var watcher = fs.watch(filename, function() {
    //connection.write("file" + filename + " changed " + Date.now() + "\n");
    connection.write(JSON.sringify({
      type: 'changed',
      file: filename,
      timestamp: Date.now()
    }) + '\n');
  });

  // cleanup
  connection.on('close', function() {
    console.log('subscriber disconnected.');
    watcher.close();
  });

});

if (!filename) {
  throw Error("no target filename was specified");
}

server.listen(8080, function() {
  console.log("listening for subscribers..");
});
