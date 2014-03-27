var net = require('net');
var client = net.connect({port:8080});

client.on('data', function(data) {
  var message = JSON.parse(data);
  if (message.type === 'watching') {
    console.log('Now Watching: ' + message.file);
  } else if (message.type === 'changed') {
    var date = new Date(message.timestamp);
    console.log("file " + message.file + " changed at " + date);
  } else {
    throw Error("uncrecognized message type: " + message.type);
  }
});
