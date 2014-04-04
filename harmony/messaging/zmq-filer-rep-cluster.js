var cluster = require('cluster');
var fs = require('fs');
var zmq = require('zmq');

if (cluster.isMaster) {
  // master process - creates ROUTER and DEALER sockets, bind endpoints
  var router = zmq.socket('router').bind('tcp://127.0.0.1:5433');
  var dealer = zmq.socket('dealer').bind('ipc://filer-dealer.ipc');

  // forward messages between router and dealer 
  router.on('message', function() {
    var frames = Array.prototype.slice.call(arguments);
    dealer.send(frames);
  });

  dealer.on('message', function() {
    var frames = Array.prototype.slice.call(arguments);
    router.send(frames);
  });

  // listne for workers to come online
  cluster.on('online', function(worker) {
    console.log('worker ' + worker.process.pid + ' is online. ');
  });

  // fork three worker processes
  for (var i = 0; i < 10; i++) {
    cluster.fork();
  }

} else {
  // worker process - create REP socket, connect to DEALER
  var responder = zmq.socket('rep').connect('ipc://filer-dealer.ipc');

  responder.on('message', function(data) {
    var request = JSON.parse(data);
    console.log(process.pid + ' recieved request for: ' + request.path);

    // read file and reply with content
    fs.readFile(request.path, function(err, data) {
      console.log(process.pid + ' sending response');
      responder.send(JSON.stringify({
        pid: process.pid,
        data: data.toString(),
        timestamp: Date.now()
      }));
    });
  });
}

