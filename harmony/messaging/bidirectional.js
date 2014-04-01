/*  TODO:
 *  MASTER process should:
 *      - Create a PUSH socket and bind it to an IPC endpoint - this socket
 *      will for sending jobs to the worker.
 *      
 *      - Create a PULL socket and bind to a different IPC endpoint - this socket
 *      will recieve messages from workers
 *      
 *      -Keep a count of ready workers, initialized to 0.
 *
 *      - LISTEN for messages on the PULL socket, and
 *          -If the message is a READY message, increment the ready counter, or
 *          -If the message is a result message, output it to the console.
 *
 *      - Spin up three worker processes
 *
 *      - When ready counter === 3, send 30 job messages out through PUSH socket.
 *
 *  WORKER process should:
 *      -Create a PULL socket and connect it to the master's PUSH endpoint.
 *      
 *      -Create a PUSH socket and connect it to the master's PULL endpoint.
 *
 *      -Listen for messages on the PULL socket, and
 *          -treat this as a job and respond by sending a result message out 
 *          on to the PUSH socket.
 *
 *      - send a READY message out on the PUSH socket.
 *
 *  Result messages should include processID of worker. 
 *
 */
var cluster = require('cluster');
var fs = require('fs');
var zmq = require('zmq');

if (cluster.isMaster) {

  // initialize ready count that tracks workers.
  var workerReady = 0;
  // create a PUSH socket and bind to IPC endpoint. 
  masterPushSocket = zmq.socket('push').bind('ipc://masterPushSocket.ipc', function(err) {
    if (err) {
      console.log(err.message);
    }
  });
  // create a PULL socket and bind to an IPC endpoint.
  masterPullSocket = zmq.socket('pull').bind('ipc://masterPullSocket.ipc', function(err) {
    if (err) {
      console.log(err.message);
    }
  });
  // listen for messages on PULL socket
  masterPullSocket.on('message', function(data) {
    console.log('got a message on masterPullSocket');
    console.log(data.toString('utf8'));
  });

  // spin up three worker processes.
  for (var i = 0; i < 3; i++) {
    cluster.fork();
  }

} else {
  //Create a PULL socket and connect it to the master's PUSH endpoint.
  var workerPullSocket = zmq.socket('pull').connect('ipc://masterPushSocket.ipc', function(err) {
    if (err) {
      console.log(err.message);
    }
  });

  //Create a PUSH socket and connect it to the master's PULL endpoint.
  var workerPushSocket = zmq.socket('push').connect('ipc://masterPullSocket.ipc', function(err) {
    if (err) {
      console.log(err.message);
    }
  });


}
