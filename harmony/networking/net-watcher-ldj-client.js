var net = require('net');
var ldj = require('./ldj.js');

var netClient = net.connect({ port:8080 });
var ldjClient = ldj.connect(netClient);

ldjClient.on('message', function(message) {
  if (message.type === 'watching') {
    console.log('now watching: ' + message.file);
  } else if (message.type === 'changed') {
    console.log(
      'File ' + message.file + ' changed at ' + new Date(message.timestamp)
    );
  } else {
    throw Error("unrecognized message type: " + message.type);
  }
});
