var fs = require('fs');
var zmq = require('zmq');

/* Here, we are creating one system-wide watcher and pushing to zmq publisher.
 *
 *
 */

// create a publisher endpoint
var publisher = zmq.socket('pub');
var filename = process.argv[2];

fs.watch(filename, function() {
  // send message to any subscriber
  publisher.send(JSON.stringify({
    type: 'changed',
    file: filename,
    timestamp: Date.now()
  }));
});

// listen on TCP port 8080
publisher.bind('tcp://*:8080', function(err) {
  console.log('Listening for zmq subscribers..');
});

