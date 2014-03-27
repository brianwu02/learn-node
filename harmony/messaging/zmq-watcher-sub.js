var zmq = require('zmq');

// create a subscriber endpoint
var subscriber = zmq.socket('sub');

// subscribe to all messages
subscriber.subscribe("");

// handle messages from subscriber
subscriber.on('message', function(data) {
  var message = JSON.parse(data);
  var date = new Date(message.timestamp);
  console.log('File ' + message.file + " changed at " + date);
});

// connect to all publishers
subscriber.connect('tcp://localhost:8080');

